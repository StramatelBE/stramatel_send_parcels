import { Router } from "express";
import { Container } from "typedi";
import { AccidentController } from "./accident.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateAccidentDto } from "./accident.validation";

const router = Router();
const accidentController = Container.get(AccidentController);

router.post(
  "/",
  authMiddleware,
  validateDto(CreateAccidentDto),
  (req, res, next) => accidentController.createAccident(req, res, next)
);
router.get("/", authMiddleware, (req, res, next) =>
  accidentController.getAllAccidents(req, res, next)
);
router.get("/:id", authMiddleware, (req, res, next) =>
  accidentController.getAccidentById(req, res, next)
);
router.put(
  "/:id",
  authMiddleware,
  validateDto(CreateAccidentDto),
  (req, res, next) => accidentController.updateAccident(req, res, next)
);
router.delete("/:id", authMiddleware, (req, res, next) =>
  accidentController.deleteAccident(req, res, next)
);

export default router;
