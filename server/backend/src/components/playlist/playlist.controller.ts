import { Playlist } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { PlaylistService } from "./playlist.service";
import { CreatePlaylistDto } from "./playlist.validation";
import { UserPayload } from "../../types/UserPayload";

interface CustomRequest extends Request {
  user?: UserPayload;
}

@Service()
export class PlaylistController {
  constructor(
    @Inject(() => PlaylistService) private playlistService: PlaylistService
  ) {}

  createPlaylist = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistData = req.body as CreatePlaylistDto;
      const newPlaylist: Playlist = await this.playlistService.createPlaylist({
        ...playlistData,
        user_id: req.user.id,
      });
      res.status(201).json({ data: newPlaylist, message: "created" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getPlaylistById = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistId: number = parseInt(req.params.playlistId);
      const playlist: Playlist | null =
        await this.playlistService.getPlaylistById(playlistId);
      if (!playlist) {
        res.status(404).json({ message: "Playlist not found" });
      } else {
        res.status(200).json({ data: playlist, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getUserPlaylists = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlists: Playlist[] = await this.playlistService.getUserPlaylists(
        req.user.id
      );
      res.status(200).json({ data: playlists, message: "playlists retrieved" });
    } catch (error) {
      next(error);
    }
  };

  updatePlaylist = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistId: number = parseInt(req.params.playlistId);
      const playlistData = req.body as CreatePlaylistDto;
      const updatedPlaylist: Playlist | null =
        await this.playlistService.updatePlaylist(playlistId, playlistData);
      if (!updatedPlaylist) {
        res.status(404).json({ message: "Playlist not found" });
      } else {
        res.status(200).json({ data: updatedPlaylist, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deletePlaylist = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistId: number = parseInt(req.params.playlistId);
      const deletedPlaylist: Playlist | null =
        await this.playlistService.deletePlaylist(playlistId);
      if (!deletedPlaylist) {
        res.status(404).json({ message: "Playlist not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateMediasInPlaylist = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistId: number = parseInt(req.params.playlistId);
      const medias = req.body;

      const updatedPlaylist: Playlist | null =
        await this.playlistService.updateMediasInPlaylist(playlistId, medias);
      if (!updatedPlaylist) {
        res.status(404).json({ message: "Playlist not found" });
      } else {
        res.status(200).json({ data: updatedPlaylist, message: "updated" });
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
  };
}
