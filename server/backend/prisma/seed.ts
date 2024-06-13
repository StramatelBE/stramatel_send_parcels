import { PrismaClient } from "@prisma/client";
import { config } from "dotenv"
import "reflect-metadata";
import { Container } from "typedi";
import { AuthService } from "../src/components/auth/auth.service"; // Assurez-vous que le chemin est correct

config();

const prisma = new PrismaClient();

async function main() {
  const authService = Container.get(AuthService);

  // Utiliser AuthService pour créer un utilisateur
  const user = await authService.register({
    username: "user",
    password: "stramatel123",
  });

  // Créer une playlist pour l'utilisateur
  const playlist1 = await prisma.playlist.create({
    data: {
      name: "Playlist 1",
      user_id: user.id,
    },
  });

  // Créer un mode
  await prisma.mode.create({
    data: {
      mode: "null",
      playlist_id: null,
    },
  });

  // Créer des paramètres
  await prisma.settings.create({
    data: {
      standby: true,
      standby_start_time: "22:00",
      standby_end_time: "06:00",
      restart_at: "03:00",
      language: "fr",
      theme: "dark",
    },
  });

  // Créer des données
  await prisma.data.create({
    data: {
      name: "Exemple int",
      data: "10",
      type: "INT",
    },
  });

  await prisma.data.create({
    data: {
      name: "Exemple bool",
      data: "false",
      type: "BOOLEAN",
    },
  });

  await prisma.data.create({
    data: {
      name: "Exemple string",
      data: "Exemple string",
      type: "STRING",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
