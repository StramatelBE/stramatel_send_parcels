import { NextFunction } from "express";
import { unlinkSync } from "fs";
import multer from "multer";
import { Inject, Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../../exceptions/HttpException";
import { MediaService } from "./media.service";
import { UserService } from "../users/users.service";
import { Media } from "@prisma/client";
import path from "path";

@Service()
export class UploadService {
  constructor(
    @Inject(() => UserService) private userService: UserService,
    @Inject(() => MediaService) private mediaService: MediaService
  ) {}

  private getExtension(mimetype: string) {
    const parts = mimetype.split("/");
    return parts[parts.length - 1];
  }

  public handleUpload = async (req: any, res: any, next: NextFunction) => {
    try {
      const destination = `${process.env.UPLOAD_DIR}${req.user.username}`;

      const upload = multer({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, destination);
          },
          filename: (req, file, cb) => {
            const ext = this.getExtension(file.mimetype);
            const filename = `${uuidv4()}.${ext}`;
            cb(null, filename);
          },
        }),
      });

      upload.single("file")(req, res, function (err) {
        if (err) {
          console.log(err);
          throw new HttpException(500, "Cannot upload file");
        }
        next();
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  public deleteMedia = async (media: Media, req: any): Promise<void> => {
    try {
      unlinkSync(
        `${process.env.UPLOAD_DIR}${req.user.username}/${media.file_name}`
      );
    } catch (error) {
      console.log(error);

      throw new HttpException(500, "Cannot delete media");
    }
  };
}
