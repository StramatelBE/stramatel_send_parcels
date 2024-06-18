import { config } from "dotenv";
import fs from "fs";
import net from "net";
import { PrismaClient } from "@prisma/client";

config();
const socketPath = process.env.SOCKET_PATH || "/tmp/unixSocket.sock";
const prisma = new PrismaClient();

// Supprimer le socket existant s'il existe
if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

// Créer un serveur Unix Socket
const server = net.createServer(async (socket) => {
  console.log('Client connected');


  const intervalId = setInterval(async () => {
    try {
      let socketData
      const modes = await prisma.mode.findMany();

      
      if (modes[0].name === "data") {
       const data = await prisma.data.findMany();
       socketData = { data:data ,mode: modes[0].name };
      }
      else if (modes[0].name === "playlist") {
        const playlist = await prisma.playlist.findUnique({where: {id: modes[0].playlist_id}, include: {
          medias: true,
        },});
        socketData = { playlist:playlist ,mode: modes[0].name };
      }else {
        socketData = { mode: modes[0].name };
      }
    
      socket.write(JSON.stringify(socketData)); 
    } catch (error) {
      console.error('Error fetching modes:', error);
      socket.write('Error fetching modes\n');
    }
  }, 1000);

  socket.on('data', (data) => {
    console.log('Received from client:', data.toString());
  });

  socket.on('end', () => {
    console.log('Client disconnected');
    clearInterval(intervalId); // Arrêter l'envoi de données lorsque le client se déconnecte
  });

  socket.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'ECONNRESET') {
      console.log('Client connection reset');
    } else {
      console.error('Socket error:', err);
    }
    clearInterval(intervalId); // Arrêter l'envoi de données en cas d'erreur
  });
});

server.listen(socketPath, () => {
  console.log(`Unix Socket Server is running on ${socketPath}`);
});