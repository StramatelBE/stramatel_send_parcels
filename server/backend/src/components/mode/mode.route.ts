import { Router } from "express";
import { Container } from "typedi";
import { ModeController } from "./mode.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateModeDto, UpdateModeDto } from "./mode.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

const modeController = Container.get(ModeController);
router.post("/", authMiddleware, validateDto(CreateModeDto), (req, res, next) =>
  modeController.createMode(req, res, next)
);

router.get("/:id", authMiddleware, (req, res, next) =>
  modeController.getModeById(req, res, next)
);

router.get("/", (req, res, next) => modeController.getModes(req, res, next));

router.put(
  "/:id",
  authMiddleware,
  validateDto(UpdateModeDto),
  (req, res, next) => modeController.updateMode(req, res, next)
);

router.delete("/:id", authMiddleware, (req, res, next) =>
  modeController.deleteMode(req, res, next)
);

export default router;
