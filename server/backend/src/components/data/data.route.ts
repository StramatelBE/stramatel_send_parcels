import { Router } from "express";
import { Container } from "typedi";
import { DataController } from "./data.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateDataDto } from "./data.validation";

const router = Router();
const dataController = Container.get(DataController);

router.post("/", authMiddleware, validateDto(CreateDataDto), (req, res, next) => dataController.createData(req, res, next));

router.get("/", authMiddleware, (req, res, next) => dataController.getAllData(req, res, next));

router.get("/:dataId", authMiddleware, (req, res, next) => dataController.getDataById(req, res, next));

router.put("/:dataId", authMiddleware, validateDto(CreateDataDto), (req, res, next) => dataController.updateData(req, res, next));

router.delete("/:dataId", authMiddleware, (req, res, next) => dataController.deleteData(req, res, next));

export default router;
