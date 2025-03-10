import { Router } from "express";
import { Container } from "typedi";
import { AppSettingController } from "./appSettings.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { SettingsDto } from "./appSettings.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const appSettingController = Container.get(AppSettingController);

router.post("/", authMiddleware, validateDto(SettingsDto), (req, res, next) =>
  appSettingController.createSetting(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  appSettingController.getSettings(req, res, next)
);

router.get("/:settingId", authMiddleware, (req, res, next) =>
  appSettingController.getSettingById(req, res, next)
);

router.put("/date", authMiddleware, (req, res, next) =>
  appSettingController.updateDate(req, res, next)
);

router.put(
  "/:settingId",
  authMiddleware,
  validateDto(SettingsDto),
  (req, res, next) => appSettingController.updateSetting(req, res, next)
);

router.delete("/:settingId", authMiddleware, (req, res, next) =>
  appSettingController.deleteSetting(req, res, next)
);

export default router;
