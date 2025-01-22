import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { AuthService } from "../src/components/auth/auth.service"; // Assurez-vous que le chemin est correct

const prisma = new PrismaClient();
async function main() {
  const authService = Container.get(AuthService);

  // Utiliser AuthService pour créer un utilisateur
  const user = await authService.register({
    username: "user",
    password: "stramatel123",
  });

  await authService.register({
    username: String(process.env.APP_USERNAME),
    password: String(process.env.APP_PASSWORD),
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
      name: "data",
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
      brightness: 10,
    },
  });

  // Créer des données
  /*  await prisma.data.create({
    data: {
      name: "Exemple int",
      value: "10",
      type: "INT",
    },
  });

  await prisma.data.create({
    data: {
      name: "Exemple bool",
      value: "false",
      type: "BOOLEAN",
    },
  });

  await prisma.data.create({
    data: {
      name: "Exemple string",
      value: "Exemple string",
      type: "STRING",
    },
  }); */
  await prisma.data.create({
    data: {
      name: "temperature",
      value: "20",
      type: "STRING",
    },
  });

  await prisma.accident.create({
    data: {
      days_without_accident: 0,
      reset_on_new_year: false,
      record_days_without_accident: 0,
      accidents_this_year: 0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
