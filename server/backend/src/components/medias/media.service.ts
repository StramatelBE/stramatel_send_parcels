import { Media, PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import * as ffmpeg from "fluent-ffmpeg";
import { UploadService } from "./upload.service";
import { NextFunction } from "express";
import { handlePlaylistUpdate } from "../../sockets/webSocketServer";

const prisma = new PrismaClient();

@Service()
export class MediaService {
  constructor(
    @Inject(() => UploadService) private uploadService: UploadService
  ) {}
  async createMedia(req: any, res: any, next: NextFunction): Promise<Media> {
    try {
      const file = await this.uploadService.handleUpload(req, res, next);
      const media = {
        original_file_name: file.originalname,
        file_name: file.filename,
        path: `/medias/${req.user.username}/${file.filename}`,
        format: file.mimetype.split("/")[1],
        type: file.mimetype.split("/")[0],
        size: file.size,
        uploaded_at: new Date(),
        user_id: req.user.id,
      };
      const newMedia = await prisma.media.create({
        data: media,
      });
      return newMedia;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Cannot create media");
    }
  }

  public getDuration(filePath: string, fileType: string): Promise<number> {
    // Vérifier si le type de fichier est une vidéo
    if (!fileType.startsWith("video")) {
      return Promise.resolve(10); // Durée fixe pour les fichiers non vidéo
    }

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.log(err);
          reject(err);
        } else resolve(metadata.format.duration);
      });
    });
  }

  async findAllMedias(): Promise<Media[]> {
    return prisma.media.findMany();
  }

  async findMedia(mediaId: number): Promise<Media> {
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new HttpException(404, `Media with ID ${mediaId} doesn't exist.`);
    }
    return media;
  }

  async updateMedia(mediaId: number, media: Partial<Media>): Promise<Media> {
    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: media,
    });
    
    // Vérifier si ce média est utilisé dans des playlistItems
    const playlistItems = await prisma.playlistItem.findMany({
      where: { media_id: mediaId },
      distinct: ['playlist_id'],
      select: { playlist_id: true }
    });
    
    // Notifier chaque playlist concernée
    for (const item of playlistItems) {
      await handlePlaylistUpdate(item.playlist_id);
    }
    
    return updatedMedia;
  }

  async getMediaCount(playlistId: number): Promise<number> {
    const mediaCount = await prisma.media.count({
      where: {
        PlaylistItem: {
          some: {
            playlist_id: playlistId,
          },
        },
      },
    });
    return mediaCount;
  }

  async deleteMedia(mediaId: number, username: string): Promise<Media> {
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      include: {
        PlaylistItem: {
          select: {
            playlist_id: true
          }
        }
      }
    });

    if (!media) {
      throw new HttpException(404, `Media with ID ${mediaId} doesn't exist.`);
    }
    
    // Collecter les IDs des playlists concernées avant de supprimer le média
    const affectedPlaylistIds = media.PlaylistItem.map(item => item.playlist_id);
    const uniquePlaylistIds = [...new Set(affectedPlaylistIds)];
    
    await this.uploadService.removeMediaFile(media, username);
    
    // Supprimer le média
    await prisma.media.delete({
      where: { id: mediaId },
    });
    
    // Notifier toutes les playlists affectées
    for (const playlistId of uniquePlaylistIds) {
      await handlePlaylistUpdate(playlistId);
    }
    
    return media;
  }
}
