// middlewares/validate.middleware.ts
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";

export const validateDto = (dtoClass: any): RequestHandler => {
  return async (req, res, next) => {
    const validationErrors: ValidationError[] = await validate(
      plainToInstance(dtoClass, req.body)
    );
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
    } else {
      next();
    }
  };
};
