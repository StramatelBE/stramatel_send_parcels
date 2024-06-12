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
