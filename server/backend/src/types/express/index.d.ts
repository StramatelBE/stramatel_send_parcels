import { UserPayload } from "../../types/UserPayload";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}