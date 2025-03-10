import express from "express";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes/routes";
import { extractUserId } from "./middlewares/extractUserId.middleware";
/* import './scheduledTasks/dailyTasks'; */

export const configureApp = (app: express.Application) => {
  app.use(cors());
  app.use(extractUserId);
  app.use(ErrorMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes);

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      status,
      message: err.message,
    });
  });
};
