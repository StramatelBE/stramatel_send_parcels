import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto, RegisterDto, ChangePasswordDto } from "./auth.validation";
import { CustomRequest } from "../../middlewares/extractUserId.middleware"; 

@Service()
export class AuthController {
  constructor(@Inject(() => AuthService) private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto & RegisterDto = req.body;
      const user: User = await this.authService.register(userData);
      res
        .status(201)
        .json({ data: user, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials: LoginUserDto = req.body;
      const token = await this.authService.login(credentials);
      res.status(200).json({ data: token, message: "Logged in successfully" });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
      const changePasswordData: ChangePasswordDto = req.body;
      const username = req.user.username;
      
      
      await this.authService.changePassword(changePasswordData, username);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  };
}
