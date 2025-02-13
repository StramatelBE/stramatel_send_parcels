import { Router } from "express";
import { Container } from "typedi";
import { PlaylistItemController } from "./playlistItem.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUserId } from "../../middlewares/extractUserId.middleware";
import {
  CreatePlaylistItemDto,
  UpdateMediasInPlaylistDto,
} from "./playlistItem.validation";
import { validateDto } from "../../middlewares/validation.middleware";

const router = Router();
const playlistItemController = Container.get(PlaylistItemController);

router.post(
  "/",
  authMiddleware,
  extractUserId,
  validateDto(CreatePlaylistItemDto),
  (req, res, next) => playlistItemController.createPlaylistItem(req, res, next)
);

router.get(
  "/:playlistItemId",
  authMiddleware,
  extractUserId,
  (req, res, next) => playlistItemController.getPlaylistItemById(req, res, next)
);

router.get(
  "/playlist/:playlistId",
  authMiddleware,
  extractUserId,
  (req, res, next) =>
    playlistItemController.getPlaylistsItemsByPlaylistId(req, res, next)
);

router.put(
  "/:playlistItemId?",
  authMiddleware,
  extractUserId,
  validateDto(UpdateMediasInPlaylistDto),
  (req, res, next) => playlistItemController.updatePlaylistItem(req, res, next)
);

router.delete(
  "/:playlistItemId",
  authMiddleware,
  extractUserId,
  (req, res, next) => playlistItemController.deletePlaylistItem(req, res, next)
);

export default router;
