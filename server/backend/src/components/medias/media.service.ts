import { Media, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import * as ffmpeg from "fluent-ffmpeg";

const prisma = new PrismaClient();

@Service()
export class MediaService {
  async createMedia(req: any, mediaPosition: number): Promise<Media> {
    const file = req.file;

    // Résoudre la durée avant de créer l'objet media
    const mediaDuration = await this.getDuration(file.path, file.mimetype);
    const media = {
      original_file_name: file.originalname,
      file_name: file.filename,
      path: `/medias/${req.user.username}/${file.filename}`,
      format: file.mimetype.split("/")[1],
      type: file.mimetype.split("/")[0],
      size: file.size,
      uploaded_at: new Date(),
      user_id: req.user.id,
      duration: mediaDuration,
      position: mediaPosition,
    };
    try {
      const newMedia = await prisma.media.create({
        data: media,
      });
      return newMedia; // Ensure the newMedia object is returned here
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Cannot create media");
    }
  }

  public async addData(type: string, userId: number, mediaCount: number, playlistId: number): Promise<Media> {
    const newMedia = {
      type: type,
      position: mediaCount + 1,
      duration: 1,
      original_file_name: type,
      file_name: type,
      path: type,
      format: type,
      size: 1,
      uploaded_at: new Date(),
      user: {
        connect: { id: userId }
      },
      Playlist: {
        connect: { id: playlistId }
      }
    };

    try {
      const createdMedia = await prisma.media.create({
        data: newMedia,
      });
      return createdMedia;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Cannot create data media");
    }
  }

  public getDuration(filePath: string, fileType: string): Promise<number> {
    // Vérifier si le type de fichier est une vidéo
    if (!fileType.startsWith("video")) {
      return Promise.resolve(10); // Durée fixe pour les fichiers non vidéo
    }

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration);
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
    return prisma.media.update({
      where: { id: mediaId },
      data: media,
    });
  }

  async getMediaCount(playlistId: number): Promise<number> {
    const mediaCount = await prisma.media.count({
      where: { playlistId: playlistId },
    });
    return mediaCount;
  }

  async deleteMedia(mediaId: number): Promise<Media> {
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new HttpException(404, `Media with ID ${mediaId} doesn't exist.`);
    }
    return prisma.media.delete({
      where: { id: mediaId },
    });
  }
}
