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
      console.log("Starting upload process...");
      console.log("User:", req.user);

      const env = process.env.NODE_ENV;
      const uploadDir = process.env[`UPLOAD_DIR_${env}`];

      if (!uploadDir) {
        throw new HttpException(500, "Upload directory not configured");
      }

      const destination = `${uploadDir}${req.user.username}`;

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
        fileFilter: (req, file, cb) => {
          // Vérifier les types de fichiers acceptés
          if (
            file.mimetype.startsWith("video/") ||
            file.mimetype.startsWith("image/")
          ) {
            cb(null, true);
          } else {
            cb(
              new Error(
                "Format de fichier non supporté. Seuls les images et vidéos sont acceptés."
              )
            );
          }
        },
        limits: {
          fileSize: 100 * 1024 * 1024, // Limite à 100MB
        },
      }).single("file");

      return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
          if (err) {
            console.error("Upload error:", err);
            reject(
              new HttpException(
                400,
                err.message || "Erreur lors de l'upload du fichier"
              )
            );
          } else {
            if (!req.file) {
              reject(new HttpException(400, "Aucun fichier n'a été uploadé"));
            } else {
              console.log("File uploaded successfully:", req.file);
              resolve(next());
            }
          }
        });
      });
    } catch (error) {
      console.error("Upload service error:", error);
      next(error);
    }
  };

  public deleteMedia = async (media: Media, req: any): Promise<void> => {
    try {
      unlinkSync(
        path.join(
          process.env[`UPLOAD_DIR_${process.env.NODE_ENV}`],
          req.user.username,
          media.file_name
        )
      );
    } catch (error) {}
  };
}
