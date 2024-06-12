import { Mode } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { ModeService } from "./mode.service";

@Service()
export class ModeController {
  constructor(@Inject(() => ModeService) private modeService: ModeService) {}

  public createMode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const modeData = req.body;
      const newMode: Mode = await this.modeService.createMode(modeData);
      res.status(201).json({ data: newMode, message: "created" });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  public getModeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const modeId = Number(req.params.id);
      const mode: Mode | null = await this.modeService.findModeById(modeId);
      if (mode) {
        res.status(200).json({ data: mode, message: "found" });
      } else {
        res.status(404).json({ message: "mode not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  public getModes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modes: Mode[] = await this.modeService.findModes();
      res.status(200).json({ data: modes, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  public updateMode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const modeId = Number(req.params.id);
      const modeData = req.body;
      const updateMode: Mode = await this.modeService.updateMode(
        modeId,
        modeData
      );
      res.status(200).json({ data: updateMode, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const modeId = Number(req.params.id);
      await this.modeService.deleteMode(modeId);
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
