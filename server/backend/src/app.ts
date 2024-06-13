import { config } from "dotenv";
import express from "express";
import cors from "cors"; // Importer cors
import "reflect-metadata";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes/routes";
import { extractUserId } from "./middlewares/extractUserId.middleware";

config();

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 4500;

app.use(cors()); // Utiliser cors comme middleware
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(ErrorMiddleware);

export default app;
