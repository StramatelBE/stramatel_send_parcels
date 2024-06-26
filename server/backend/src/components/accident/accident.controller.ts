import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { AccidentService } from "./accident.service";
import { CreateAccidentDto } from "./accident.validation";

@Service()
export class AccidentController {
  constructor(
    @Inject(() => AccidentService) private accidentService: AccidentService
  ) {}

  createAccident = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateAccidentDto = req.body;
      const accident = await this.accidentService.createAccident(dto);
      res.status(201).json({ accident, message: "Accident created" });
    } catch (error) {
      next(error);
    }
  };

  getAccidentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const accident = await this.accidentService.getAccidentById(id);
      if (!accident) {
        res.status(404).json({ message: "Accident not found" });
      } else {
        res.status(200).json({ accident, message: "Accident found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateAccident = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const dto: CreateAccidentDto = req.body;
      const updatedAccident = await this.accidentService.updateAccident(
        id,
        dto
      );
      if (!updatedAccident) {
        res.status(404).json({ message: "Accident not found" });
      } else {
        res
          .status(200)
          .json({ accident: updatedAccident, message: "Accident updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteAccident = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const deletedAccident = await this.accidentService.deleteAccident(id);
      if (!deletedAccident) {
        res.status(404).json({ message: "Accident not found" });
      } else {
        res.status(200).json({ message: "Accident deleted" });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllAccidents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accidents = await this.accidentService.getAllAccidents();
      res.status(200).json({ accidents, message: "All accidents retrieved" });
    } catch (error) {
      next(error);
    }
  };
}
