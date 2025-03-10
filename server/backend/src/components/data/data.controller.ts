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

  updateData = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      const dataDto: UpdateDataDto = req.body;
      const updatedData: Data | null = await this.dataService.updateData(
        dataId,
        dataDto,
        req.user.username
      );
      if (!updatedData) {
        res.status(404).json({ message: "Data not found" });
      } else {
        res.status(200).json({ data: updatedData, message: "Data updated" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteData = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dataId: number = parseInt(req.params.dataId);
      const deletedData: Data | null = await this.dataService.deleteData(
        dataId,
        req.user.username
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
