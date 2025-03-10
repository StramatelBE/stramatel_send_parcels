import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { CustomRequest } from "../../middlewares/extractUserId.middleware";
import { MediaService } from "./media.service";

@Service()
export class MediaController {
  constructor(@Inject(() => MediaService) private mediaService: MediaService) {}

  uploadFile = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await this.mediaService.createMedia(req, res, next);
      res.status(201).json({ message: "uploaded", file });
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

  deleteMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { media_id } = req.params;
      await this.mediaService.deleteMedia(
        parseInt(media_id),
        req.user.username
      );
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
