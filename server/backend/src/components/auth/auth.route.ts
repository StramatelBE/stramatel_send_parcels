import { Router } from "express";
import { Container } from "typedi";
import { AuthController } from "./auth.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { AuthCredentialsDto, ChangePasswordDto } from "./auth.validation";
import { extractUserId } from "../../middlewares/extractUserId.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const authController = Container.get(AuthController);

router.post("/login", validateDto(AuthCredentialsDto), (req, res, next) =>
  authController.login(req, res, next)
);

router.post("/register", validateDto(AuthCredentialsDto), (req, res, next) =>
  authController.register(req, res, next)
);

router.post("/change-password", authMiddleware, validateDto(ChangePasswordDto), extractUserId, (req, res, next) =>
  authController.changePassword(req, res, next)
);

export default router;
