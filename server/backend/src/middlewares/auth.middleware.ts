import { HttpException } from "../exceptions/HttpException";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/UserPayload";

const prisma = new PrismaClient();
const getAuthorization = (req) => {
  const header = req.header("Authorization");

  if (header) {
    return header.split(" ")[1];
  }

  return null;
};

export const authMiddleware = async (req, res, next) => {
  const token = getAuthorization(req);
  if (!token) {
    return next(
      new HttpException(
        401,
        "Accès refusé. Aucun jeton d'authentification fourni."
      )
    );
  }

 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    req.user = decoded; // Ajouter l'utilisateur à l'objet Request

    
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.setHeader("x-auth-token", newToken);
    }


    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Jeton d'authentification expiré."));
    }
    throw new HttpException(400, "Jeton d'authentification invalide.");
  }
};
