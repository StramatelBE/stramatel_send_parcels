import { Media, User } from "@prisma/client";
import { NextFunction } from "express";
import { unlinkSync } from "fs";
import multer from "multer";
import path from "path";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../../exceptions/HttpException";

@Service()
export class UploadService {
  constructor() {}

  private getExtension(mimetype: string) {
    const parts = mimetype.split("/");
    return parts[parts.length - 1];
  }

  public handleUpload = async (
    req: any,
    res: any,
    next: NextFunction
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const env = process.env.NODE_ENV;
      const uploadDir = process.env[`UPLOAD_DIR_${env}`];

      if (!uploadDir) {
        return reject(
          new HttpException(500, "Upload directory not configured")
        );
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

      upload(req, res, function (err) {
        if (err) {
          console.error("Upload error:", err);
          return reject(
            new HttpException(
              400,
              err.message || "Erreur lors de l'upload du fichier"
            )
          );
        } else {
          if (!req.file) {
            return reject(
              new HttpException(400, "Aucun fichier n'a été uploadé")
            );
          } else {
            resolve(req.file);
          }
        }
      });
    });
  };

  public removeMediaFile = async (
    media: Media,
    username: string
  ): Promise<void> => {
    try {
      unlinkSync(
        path.join(
          process.env[`UPLOAD_DIR_${process.env.NODE_ENV}`],
          username,
          media.file_name
        )
      );
    } catch (error) {
      console.error("Error removing media file:", error);
    }
  };
}
