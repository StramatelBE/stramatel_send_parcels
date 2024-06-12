import { Router } from "express";
import { Container } from "typedi";
import { UserController } from "./users.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "./users.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

const userController = Container.get(UserController);
router.post("/", validateDto(CreateUserDto), (req, res, next) =>
  userController.createUser(req, res, next)
);

router.get("/:id", authMiddleware, (req, res, next) =>
  userController.getUserById(req, res, next)
);

router.get("/", (req, res, next) => userController.getUsers(req, res, next));

router.put(
  "/:id",
  authMiddleware,
  validateDto(UpdateUserDto),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.delete("/:id", authMiddleware, (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
