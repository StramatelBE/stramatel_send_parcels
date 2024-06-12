import { Router } from "express";
import { Container } from "typedi";
import { PlaylistController } from "./playlist.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUserId } from "../../middlewares/extractUserId.middleware";

const router = Router();
const playlistController = Container.get(PlaylistController);

router.post("/", authMiddleware, extractUserId, (req, res, next) =>
  playlistController.createPlaylist(req, res, next)
);

router.get("/:playlistId", authMiddleware, extractUserId, (req, res, next) =>
  playlistController.getPlaylistById(req, res, next)
);

router.get("/", authMiddleware, extractUserId, (req, res, next) =>
  playlistController.getUserPlaylists(req, res, next)
);

router.put("/:playlistId", authMiddleware, extractUserId, (req, res, next) =>
  playlistController.updatePlaylist(req, res, next)
);

router.put(
  "/:playlistId/medias",
  authMiddleware,
  extractUserId,
  (req, res, next) => playlistController.updateMediasInPlaylist(req, res, next)
);

router.delete("/:playlistId", authMiddleware, extractUserId, (req, res, next) =>
  playlistController.deletePlaylist(req, res, next)
);

export default router;
