import { PrismaClient, Playlist, Media } from "@prisma/client";
import { Service } from "typedi";
import { CreatePlaylistDto } from "./playlist.validation";

const prisma = new PrismaClient();
interface PlaylistWithMedia extends Playlist {
  medias: Media[];
}
@Service()
export class PlaylistService {
  async getAllPlaylists(): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany({
      include: {
        medias: true,
      },
    });
    return playlists;
  }

  async getPlaylistById(id: number): Promise<PlaylistWithMedia | null> {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        medias: true,
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
    return playlist;
  }

  async deletePlaylist(id: number): Promise<Playlist | null> {
    const playlist = await prisma.playlist.delete({
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
        medias: {
          connect: { id: mediaId },
        },
      },
    });
    return playlist;
  }

  async updateMediasInPlaylist(id: number, medias: Media[]): Promise<Playlist> {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { medias: true },
    });

    if (!playlist) throw new Error("Playlist not found");

    // Mise à jour de l'ordre des médias
    for (const media of medias) {
      await prisma.media.update({
        where: { id: media.id },
        data: { position: media.position },
      });
    }

    return prisma.playlist.findUnique({
      where: { id },
      include: { medias: true },
    });
  }
}
