import { Server } from "ws";
import { PrismaClient } from "@prisma/client";

const port: number = parseInt(process.env.WEBSOCKET_PORT) || 8080;
const prisma = new PrismaClient();

const server = new Server({ port });

server.on("connection", (ws) => {
  console.log("Client connected");

  const intervalId = setInterval(async () => {
    try {
      let socketData;
      const modes = await prisma.mode.findMany();
      const data = await prisma.data.findMany();
      const accident = await prisma.accident.findMany();
      const settings = await prisma.settings.findMany();

      socketData = {
        accident: accident[0],
        settings: settings[0],
        mode: modes[0],
      };
      if (data) {
        socketData = { ...socketData, data: data };
      }

      if (modes[0].name === "playlist") {
        const playlist = await prisma.playlist.findUnique({
          where: { id: modes[0].playlist_id },
          include: { medias: true },
        });
        if (playlist) {
          socketData = { ...socketData, playlist: playlist };
        }
      }
      socketData.temperature = data[0].value;
      ws.send(JSON.stringify(socketData));
    } catch (error) {
      console.error("Error fetching modes:", error);
      ws.send("Error fetching modes\n");
    }
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    clearInterval(intervalId);
  });
});

console.log(`WebSocket Server is running on port ${port}`);
