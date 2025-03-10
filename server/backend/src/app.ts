import express from "express";
import "reflect-metadata";
import { configureApp } from "./configureApp";
import { wsServer } from "./sockets/webSocketServer";

const app = express();
const port: number = process.env.API_PORT
  ? parseInt(process.env.API_PORT)
  : 4500;

configureApp(app);

const server = app.listen(port, () => {
  console.log(`Serveur API démarré et en écoute sur le port ${port}`);
});

// Gestion de l'arrêt propre des serveurs
process.on("SIGINT", () => {
  console.log("Arrêt des serveurs...");
  server.close(() => {
    console.log("Serveur API arrêté");
  });

  wsServer.close(() => {
    console.log("Serveur WebSocket arrêté");
    process.exit(0);
  });
});

export default app;
