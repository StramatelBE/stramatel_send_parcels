import { PrismaClient, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import {
  LoginUserDto,
  RegisterDto,
  ChangePasswordDto,
} from "./auth.validation";

const prisma = new PrismaClient();

@Service()
export class AuthService {
  async register(userData: RegisterDto): Promise<User> {
    const findUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });
    if (findUser) {
      throw new HttpException(
        409,
        `This username ${userData.username} already exists`
      );
    }
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        username: userData.username,
        password: hashedPassword,
        language: "fr",
        theme: "dark",
      },
    });
    const env = process.env.NODE_ENV;
    const uploadDir = process.env[`UPLOAD_DIR_${env}`] + user.username;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return user;
  }

  async login(credentials: LoginUserDto): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { username: credentials.username },
    });

    if (!user) {
      throw new HttpException(401, "Incorrect username or password");
    }

    const isValidPassword = await bcryptjs.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException(401, "Incorrect username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }

  async changePassword(
    changePasswordData: ChangePasswordDto,
    username: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isValidPassword = await bcryptjs.compare(
      changePasswordData.oldPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException(400, "Incorrect old password");
    }

    const hashedNewPassword = await bcryptjs.hash(
      changePasswordData.newPassword,
      10
    );
    await prisma.user.update({
      where: { username: username },
      data: { password: hashedNewPassword },
    });
  }
}
