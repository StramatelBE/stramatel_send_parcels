import { Router } from "express";
import { Container } from "typedi";
import { MediaController } from "./media.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUserId } from "../../middlewares/extractUserId.middleware";
const router = Router();
const mediaController = Container.get(MediaController);

router.post("/", authMiddleware, extractUserId, (req, res, next) =>
  mediaController.uploadFile(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  mediaController.getAllMedia(req, res, next)
);

router.get("/:media_id", authMiddleware, (req, res, next) =>
  mediaController.getMediaById(req, res, next)
);

router.put("/:media_id", authMiddleware, (req, res, next) =>
  mediaController.updateMedia(req, res, next)
);

router.delete("/:media_id", authMiddleware, mediaController.deleteMedia);

export default router;
