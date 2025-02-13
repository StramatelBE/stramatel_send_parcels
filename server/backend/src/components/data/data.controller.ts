import { Data } from "@prisma/client";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { CustomRequest } from "../../middlewares/extractUserId.middleware";
import { DataService } from "./data.service";
import { CreateDataDto, UpdateDataDto } from "./data.validation";

@Service()
export class DataController {
  constructor(@Inject(() => DataService) private dataService: DataService) {}

  createData = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dataDto: CreateDataDto = req.body;
      const errors = await validate(dataDto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const newData: Data = await this.dataService.createData({
        ...dataDto,
        user_id: req.user.id,
      });
      res.status(201).json({ data: newData, message: "Data created" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getDataById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      const data: Data | null = await this.dataService.getDataById(dataId);
      if (!data) {
        res.status(404).json({ message: "Data not found" });
      } else {
        res.status(200).json({ data: data, message: "Data found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      const dataDto: UpdateDataDto = req.body;
      console.log("dataDto");
      console.log(dataDto);
      console.log("dataId");
      console.log(dataId);
      const updatedData: Data | null = await this.dataService.updateData(
        dataId,
        dataDto
      );
      if (!updatedData) {
        res.status(404).json({ message: "Data not found" });
      } else {
        res.status(200).json({ data: updatedData, message: "Data updated" });
      }
    } catch (error) {
      console.log("error");
      console.log(error);
      next(error);
    }
  };

  uploadBackground = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      /*  await this.uploadService.handleUpload(req, res, async () => {
        if (!req.file) {
          res.status(400).json({ message: "No file uploaded" });
          return;
        }
        const oldData = await this.dataService.getDataById(dataId);
        if (oldData?.background_id) {
          const oldMedia = await this.mediaService.findMedia(
            oldData.background_id
          );
          await this.mediaService.deleteMedia(oldData.background_id);
          await this.uploadService.removeMediaFile(oldMedia, req);
        }
        const media = await this.mediaService.createMedia(req, 0);
        const updatedData: Data | null = await this.dataService.updateData(
          dataId,
          { background_id: media.id }
        );

        if (!updatedData) {
          res.status(404).json({ message: "Data not found" });
        } else {
          res.status(200).json({
            data: updatedData,
            message: "Background uploaded successfully",
          });
        }
      }); */
    } catch (error) {
      next(error);
    }
  };
  deleteBackground = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      /* const dataId: number = parseInt(req.params.dataId);

      const deletedData: Data | null = await this.dataService.deleteData(
        dataId
      );
      if (!deletedData) {
        res.status(404).json({ message: "Data not found" });
      } else {
        const oldMedia = await this.mediaService.findMedia(
          deletedData.background_id
        );
        await this.mediaService.deleteMedia(deletedData.background_id);
        await this.uploadService.deleteMedia(oldMedia, req);
      } */
    } catch (error) {
      next(error);
    }
  };

  deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      const deletedData: Data | null = await this.dataService.deleteData(
        dataId
      );
      if (!deletedData) {
        res.status(404).json({ message: "Data not found" });
      } else {
        res.status(200).json({ message: "Data deleted" });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: Data[] = await this.dataService.getAllData();
      res.status(200).json({ data: data, message: "All data retrieved" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
