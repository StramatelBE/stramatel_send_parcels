import { AppSettings } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { SettingService } from "./appSettings.service";
import { SettingsDto } from "./appSettings.validation";
import { Settings } from "http2";

@Service()
export class AppSettingController {
  constructor(
    @Inject(() => SettingService)
    private settingService: SettingService
  ) {}
  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings: AppSettings[] = await this.settingService.getSettings();
      res.status(200).json({ data: settings, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  createSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingData: SettingsDto = req.body;
      const newSetting: AppSettings = await this.settingService.createSetting(
        settingData
      );
      res.status(201).json({ data: newSetting, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  getSettingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const setting: AppSettings | null =
        await this.settingService.getSettingById(settingId);

      if (!setting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res.status(200).json({ data: setting, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const settingData: SettingsDto = req.body;
      const updatedSetting: AppSettings | null =
        await this.settingService.updateSetting(settingId, settingData);

      if (!updatedSetting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res.status(200).json({ data: updatedSetting, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date: string = req.body.date as string;
      const updateddate = await this.settingService.updateDate(date);
      res.status(200).json({ data: updateddate, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  deleteSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const deletedSetting: AppSettings | null =
        await this.settingService.deleteSetting(settingId);

      if (!deletedSetting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
