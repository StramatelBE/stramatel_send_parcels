import { PrismaClient, Playlist, Media } from "@prisma/client";
import { Service, Inject } from "typedi";
import { CreatePlaylistDto } from "./playlist.validation";
import { UploadService } from "../medias/upload.service";
import { handlePlaylistUpdate } from "../../sockets/webSocketServer";

const prisma = new PrismaClient();

interface PlaylistWithMedia extends Playlist {
  PlaylistItem: {
    media: Media;
  }[];
}

@Service()
export class PlaylistService {
  constructor(
    @Inject(() => UploadService) private uploadService: UploadService
  ) {}

  async getAllPlaylists(): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany({
      include: {
        PlaylistItem: {
          include: {
            media: true,
          },
        },
      },
    });
    return playlists;
  }

  async getPlaylistById(id: number): Promise<PlaylistWithMedia | null> {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        PlaylistItem: {
          include: {
            media: true,
            data: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return playlist;
  }

  async createPlaylist(playlistData: CreatePlaylistDto): Promise<Playlist> {
    const playlist = await prisma.playlist.create({
      data: {
        name: playlistData.name,
        user_id: playlistData.user_id,
      },
    });

    // Aucune notification nécessaire car la playlist est vide

    return playlist;
  }

  async updatePlaylist(
    id: number,
    playlistData: CreatePlaylistDto
  ): Promise<Playlist | null> {
    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        name: playlistData.name,
      },
    });
    
    // Notifier le WebSocket de la mise à jour (même si c'est juste le nom qui change)
    await handlePlaylistUpdate(id);
    
    return playlist;
  }

  async deletePlaylist(id: number, username: string): Promise<Playlist | null> {
    // Récupérer les médias associés à la playlist
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { PlaylistItem: { include: { media: true } } },
    });

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    // Notifier le WebSocket de la suppression de la playlist
    // (permettra d'arrêter la lecture si cette playlist était en cours de lecture)
    await handlePlaylistUpdate(id);

    console.log("Playlist supprimée");
    for (const item of playlist.PlaylistItem) {
      if (
        item.media &&
        (item.media.type === "image" || item.media.type === "video")
      ) {
        await this.uploadService.removeMediaFile(item.media, username);
      }
    }
    
    // Récupérer les IDs de média valides (non null et non undefined)
    const mediaIds = playlist.PlaylistItem
      .map(item => item.media_id)
      .filter(id => id !== null && id !== undefined);
    
    // Supprimer les médias associés à la playlist seulement s'il y en a
    if (mediaIds.length > 0) {
      await prisma.media.deleteMany({
        where: { id: { in: mediaIds } },
      });
    }
    
    // Supprimer la playlist et les médias associés de la base de données
    await prisma.playlist.delete({
      where: { id },
    });

    return playlist;
  }

  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    return prisma.playlist.findMany({
      where: { user_id: userId },
    });
  }

  async addMediaToPlaylist(id: number, mediaId: number): Promise<Playlist> {
    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        PlaylistItem: {
          connect: { id: mediaId },
        },
      },
    });
    
    // Notifier le WebSocket de l'ajout d'un média à la playlist
    await handlePlaylistUpdate(id);
    
    return playlist;
  }

  async updateMediasInPlaylist(id: number, medias: Media[]): Promise<Playlist> {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { PlaylistItem: { include: { media: true } } },
    });

    if (!playlist) throw new Error("Playlist not found");

    // Mise à jour de l'ordre des médias
    for (const media of medias) {
      await prisma.media.update({
        where: { id: media.id },
        data: {},
      });
    }
    
    // Notifier le WebSocket de la modification de l'ordre des médias
    await handlePlaylistUpdate(id);

    return prisma.playlist.findUnique({
      where: { id },
      include: { PlaylistItem: { include: { media: true } } },
    });
  }
}
