import { PrismaClient, Playlist, Media, PlaylistItem } from "@prisma/client";
import { Service, Inject } from "typedi";
import {
  CreatePlaylistItemDto,
  UpdateMediasInPlaylistDto,
} from "./playlistItem.validation";
import { UploadService } from "../medias/upload.service";
import { PlaylistService } from "../playlist/playlist.service";
const prisma = new PrismaClient();

interface PlaylistItemWithMedia extends PlaylistItem {
  media: Media;
}

@Service()
export class PlaylistItemService {
  constructor(
    @Inject(() => UploadService) private uploadService: UploadService,
    @Inject(() => PlaylistService) private playlistService: PlaylistService
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

  async getPlaylistItemById(id: number): Promise<PlaylistItemWithMedia | null> {
    const playlistItem = await prisma.playlistItem.findUnique({
      where: { id },
      include: {
        media: true,
      },
    });
    return playlistItem;
  }

  async createPlaylistItem(
    playlistItemData: CreatePlaylistItemDto
  ): Promise<PlaylistItemWithMedia> {
    const playlistItem = await prisma.playlistItem.create({
      data: {
        playlist_id: playlistItemData.playlist_id,
        media_id: playlistItemData.media_id,
        data_id: playlistItemData.data_id,
        position: playlistItemData.position,
        duration: playlistItemData.duration || 10,
      },
      include: {
        media: true,
      },
    });

    return playlistItem;
  }

  async updatePlaylistItem(
    id: number,
    playlistItemData: UpdateMediasInPlaylistDto
  ): Promise<PlaylistItem | null> {
    const playlistItem = await prisma.playlistItem.update({
      where: { id },
      data: {
        position: playlistItemData.position,
        duration: playlistItemData.duration,
        media_id: playlistItemData.media_id,
        data_id: playlistItemData.data_id,
      },
    });
    return prisma.playlistItem.findUnique({
      where: { id },
      include: {
        media: true,
        data: true,
      },
    });
  }

  async deletePlaylistItem(
    id: number,
    userId: number
  ): Promise<PlaylistItem | null> {
    // Récupérer les médias associés à la playlist
    const playlistItem = await prisma.playlistItem.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!playlistItem) {
      throw new Error("PlaylistItem not found");
    }

    // Supprimer les fichiers médias du système de fichiers
    if (playlistItem.media) {
      if (
        playlistItem.media.type === "image" ||
        playlistItem.media.type === "video"
      ) {
        await this.uploadService.removeMediaFile(playlistItem.media, userId);
        // Supprimer le média de la base de données
        await prisma.media.delete({
          where: { id: playlistItem.media.id },
        });
      }
    }

    // Supprimer la playlist et les médias associés de la base de données
    await prisma.playlistItem.delete({
      where: { id },
    });

    return playlistItem;
  }

  async getPlaylistsItemsByPlaylistId(
    playlistId: number
  ): Promise<PlaylistItem[]> {
    return prisma.playlistItem.findMany({
      where: { playlist_id: playlistId },
      include: { media: true },
    });
  }

  async addMediaToPlaylistItem(
    id: number,
    mediaId: number
  ): Promise<PlaylistItem> {
    const playlistItem = await prisma.playlistItem.update({
      where: { id },
      data: {
        playlist: {
          connect: { id: mediaId },
        },
      },
    });
    return playlistItem;
  }

  async updateMediasInPlaylistItem(
    id: number,
    medias: Media[]
  ): Promise<PlaylistItem> {
    const playlistItem = await prisma.playlistItem.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!playlistItem) throw new Error("PlaylistItem not found");

    // Mise à jour de l'ordre des médias
    for (const media of medias) {
      await prisma.media.update({
        where: { id: media.id },
        data: {},
      });
    }

    return prisma.playlistItem.findUnique({
      where: { id },
      include: { media: true },
    });
  }

  async setPositionForPlaylistItem(
    playlistItemData: CreatePlaylistItemDto
  ): Promise<CreatePlaylistItemDto> {
    const playlist = await this.playlistService.getPlaylistById(
      playlistItemData.playlist_id
    );
    playlistItemData.position = playlist.PlaylistItem.length + 1;
    return playlistItemData;
  }

  async updateMultiplePlaylistItems(
    playlistItems: { id: number; position: number; duration: number }[]
  ): Promise<PlaylistItem[]> {
    const updatedItems = await Promise.all(
      playlistItems.map(async (item) => {
        return prisma.playlistItem.update({
          where: { id: item.id },
          data: {
            position: item.position,
            duration: item.duration,
          },
          include: {
            media: true,
            data: true,
          },
        });
      })
    );

    return updatedItems;
  }
}
