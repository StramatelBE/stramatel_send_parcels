import { Playlist, PlaylistItem } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { PlaylistItemService } from "./playlistItem.service";
import {
  CreatePlaylistItemDto,
  UpdateMediasInPlaylistDto,
} from "./playlistItem.validation";
import { CustomRequest } from "../../middlewares/extractUserId.middleware";
import { PlaylistService } from "../playlist/playlist.service";
import { log } from "console";

@Service()
export class PlaylistItemController {
  constructor(
    @Inject(() => PlaylistItemService)
    private playlistItemService: PlaylistItemService,
    @Inject(() => PlaylistService)
    private playlistService: PlaylistService
  ) {}

  createPlaylistItem = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let playlistItemData: CreatePlaylistItemDto = req.body;
      playlistItemData =
        await this.playlistItemService.setPositionForPlaylistItem(
          playlistItemData
        );
      const newPlaylistItem: PlaylistItem =
        await this.playlistItemService.createPlaylistItem(playlistItemData);
      if (!newPlaylistItem) {
        res.status(404).json({ message: "PlaylistItem not found" });
      } else {
        res.status(201).json({ data: newPlaylistItem, message: "created" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getPlaylistItemById = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistItemId: number = parseInt(req.params.playlistItemId);
      const playlistItem: PlaylistItem | null =
        await this.playlistItemService.getPlaylistItemById(playlistItemId);
      if (!playlistItem) {
        res.status(404).json({ message: "PlaylistItem not found" });
      } else {
        res.status(200).json({ data: playlistItem, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getPlaylistsItemsByPlaylistId = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistsItems: PlaylistItem[] =
        await this.playlistItemService.getPlaylistsItemsByPlaylistId(
          parseInt(req.params.playlistId)
        );
      res
        .status(200)
        .json({ data: playlistsItems, message: "playlists retrieved" });
    } catch (error) {
      next(error);
    }
  };

  updatePlaylistItem = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistData = req.body;
      let result;

      // Si c'est un tableau, on utilise la mise à jour multiple
      if (Array.isArray(playlistData)) {
        result = await this.playlistItemService.updateMultiplePlaylistItems(
          playlistData
        );
      } else {
        // Sinon on utilise la mise à jour simple
        const playlistItemId: number = parseInt(req.params.playlistItemId);
        result = await this.playlistItemService.updatePlaylistItem(
          playlistItemId,
          playlistData
        );
      }

      if (!result) {
        res.status(404).json({ message: "PlaylistItem not found" });
      } else {
        res.status(200).json({ data: result, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deletePlaylistItem = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistItemId: number = parseInt(req.params.playlistItemId);
      const deletedPlaylistItem: PlaylistItem | null =
        await this.playlistItemService.deletePlaylistItem(
          playlistItemId,
          req.user.username
        );
      if (!deletedPlaylistItem) {
        res.status(404).json({ message: "PlaylistItem not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateMediasInPlaylistItem = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistItemId: number = parseInt(req.params.playlistItemId);
      const medias = req.body;

      const updatedPlaylistItem: PlaylistItem | null =
        await this.playlistItemService.updateMediasInPlaylistItem(
          playlistItemId,
          medias
        );
      if (!updatedPlaylistItem) {
        res.status(404).json({ message: "PlaylistItem not found" });
      } else {
        res.status(200).json({ data: updatedPlaylistItem, message: "updated" });
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  updateMultiplePlaylistItems = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistItems = req.body;
      const updatedItems =
        await this.playlistItemService.updateMultiplePlaylistItems(
          playlistItems
        );
      res.status(200).json({ data: updatedItems, message: "updated" });
    } catch (error) {
      next(error);
    }
  };
}
