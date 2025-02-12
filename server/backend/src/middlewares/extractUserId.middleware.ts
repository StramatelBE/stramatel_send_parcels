import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/UserPayload";

export interface CustomRequest extends Request {
  user?: UserPayload;
  file?: Express.Multer.File;
}

export const extractUserId = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    req.user.id = Number(req.user.id);
    req.user.username = String(req.user.username);
  }
  next();
};
