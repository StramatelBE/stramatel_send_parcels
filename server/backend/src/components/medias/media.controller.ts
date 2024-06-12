import { Media } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { MediaService } from "./media.service";
import { UploadService } from "./upload.service";
import { PlaylistService } from "../playlist/playlist.service";

@Service()
export class MediaController {
  constructor(
    @Inject(() => MediaService) private mediaService: MediaService,
    @Inject(() => UploadService) private uploadService: UploadService,
    @Inject(() => PlaylistService) private playlistService: PlaylistService
  ) {}

  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.uploadService.handleUpload(req, res, async () => {
        const playlistId = parseInt(req.body.playlistId, 10);
        const playlist = await this.playlistService.getPlaylistById(playlistId);

        const mediaPosition = playlist.medias.length;
        const newMedia = await this.mediaService.createMedia(
          req,
          mediaPosition
        );

        if (playlistId) {
          await this.playlistService.addMediaToPlaylist(
            playlistId,
            newMedia.id
          );
        }

        res.status(201).json({
          message: "File uploaded and added to playlist successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  };

  getAllMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const media = await this.mediaService.findAllMedias();
      res.status(200).json({ data: media, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  getMediaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { media_id } = req.params;
      const media = await this.mediaService.findMedia(parseInt(media_id));
      res.status(200).json({ data: media, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  updateMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { media_id } = req.params;
      const media = req.body;
      const updatedMedia = await this.mediaService.updateMedia(
        parseInt(media_id),
        media
      );
      res.status(200).json({ data: updatedMedia, message: "updated" });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { media_id } = req.params;
      const media = await this.mediaService.findMedia(parseInt(media_id));
      await this.mediaService.deleteMedia(parseInt(media_id)).then(() => {
        this.uploadService.deleteMedia(media, req);
        res.status(200).json({ message: "deleted" });
      });
    } catch (error) {
      next(error);
    }
  };
}
