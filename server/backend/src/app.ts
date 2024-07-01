
import express from "express";
import "reflect-metadata";
import { configureApp } from "./configureApp";


const app = express();
const port: number = process.env.API_PORT ? parseInt(process.env.API_PORT) : 4500;

configureApp(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import "./sockets/webSocketServer";
export default app;