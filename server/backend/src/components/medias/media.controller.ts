import { Media } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { MediaService } from "./media.service";
import { UploadService } from "./upload.service";
import { PlaylistService } from "../playlist/playlist.service";
import { UserPayload } from "../../types/UserPayload";
import { PlaylistItemService } from "../playlistItem/playlistItem.service";
import { CustomRequest } from "../../middlewares/extractUserId.middleware";
import { HttpException } from "../../exceptions/HttpException";

@Service()
export class MediaController {
  constructor(
    @Inject(() => MediaService) private mediaService: MediaService,
    @Inject(() => UploadService) private uploadService: UploadService,
    @Inject(() => PlaylistService) private playlistService: PlaylistService,
    @Inject(() => PlaylistItemService)
    private playlistItemService: PlaylistItemService
  ) {}

  uploadFile = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.uploadService.handleUpload(req, res, async () => {
        if (!req.file) {
          throw new HttpException(400, "Aucun fichier n'a été reçu");
        }

        const playlistId = parseInt(req.body.playlistId, 10);
        if (isNaN(playlistId)) {
          throw new HttpException(400, "ID de playlist invalide");
        }

        const playlist = await this.playlistService.getPlaylistById(playlistId);

        const media = await this.mediaService.createMedia(
          req,
          playlist.PlaylistItem.length + 1
        );
        const playlistItems = await this.playlistItemService.createPlaylistItem(
          {
            position: playlist.PlaylistItem.length + 1,
            duration: await this.mediaService.getDuration(
              req.file.path,
              media.type
            ),
            playlist_id: playlistId,
            media_id: media.id,
          }
        );
        console.log(playlistItems);

        res.status(201).json({
          message: "Fichier uploadé et ajouté à la playlist avec succès",
          data: {
            media: media,
            playlistItem: playlistItems,
          },
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
        if (media.type === "image" || media.type === "video") {
          this.uploadService.deleteMedia(media, req);
        }
        res.status(200).json({ message: "deleted" });
      });
    } catch (error) {
      next(error);
    }
  };
}
