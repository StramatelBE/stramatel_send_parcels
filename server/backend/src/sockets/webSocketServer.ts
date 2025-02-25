import { Server } from "ws";
import { PrismaClient } from "@prisma/client";

const port: number = parseInt(process.env.WEBSOCKET_PORT) || 8080;
const prisma = new PrismaClient();

const server = new Server({ port });

// Définir des interfaces pour les types
interface PlaylistState {
  currentIndex: number;
  items: any[];
  lastChange: number;
  playlistId: number;
  modeName: string;
  timeoutId?: NodeJS.Timeout; // Stocker l'ID du timeout pour éviter les doublons
  lastUpdated?: number; // Horodatage de la dernière mise à jour de la base de données
}

interface CurrentItem {
  id: any;
  position: any;
  duration: any;
  contentType: "media" | "data"; // Type de contenu
  media?: any; // Contenu média (si applicable)
  data?: any; // Contenu data (si applicable)
}

interface PlaylistItemToSend {
  modeId: number;
  modeName: string;
  playlistId: number;
  currentItem: CurrentItem;
  isMainPlaylist?: boolean;
  isTestMode?: boolean;
}

// Stocker l'état global des playlists actives
const playlistStates = new Map<number, PlaylistState>();

// Intervalle de vérification des changements de base de données (en ms)
const DB_CHECK_INTERVAL = 5000; // 5 secondes

// Ajouter un intervalle de rechargement forcé
const FORCE_RELOAD_INTERVAL = 300000; // 5 minutes (en ms)

// Fonction pour vérifier les changements dans la base de données
async function checkForDatabaseChanges() {
  console.log("Vérification des changements dans la base de données...");
  const modes = await prisma.mode.findMany();
  let changesDetected = false;
  const currentTime = Date.now();

  for (const mode of modes) {
    if (
      (mode.name === "playlist" || mode.name === "test") &&
      mode.playlist_id
    ) {
      try {
        // Récupérer les éléments de la playlist depuis la base de données
        const playlistItems = await prisma.playlistItem.findMany({
          where: { playlist_id: mode.playlist_id },
          orderBy: { position: "asc" },
          include: { media: true, data: true },
        });

        const currentState = playlistStates.get(mode.playlist_id);

        // Vérifier si la playlist a changé (nombre d'éléments, ordre, contenu)
        if (currentState) {
          // Forcer un rechargement périodique pour éviter les problèmes de désynchronisation
          const timeSinceLastUpdate =
            currentTime - (currentState.lastUpdated || 0);
          const forceReload = timeSinceLastUpdate > FORCE_RELOAD_INTERVAL;

          if (forceReload) {
            console.log(
              `Rechargement forcé de la playlist ${mode.playlist_id} après ${
                timeSinceLastUpdate / 1000
              } secondes`
            );
            changesDetected = true;
          } else if (currentState.items.length !== playlistItems.length) {
            // Vérifier si le nombre d'éléments a changé
            console.log(
              `Nombre d'éléments modifié pour la playlist ${mode.playlist_id}: ${currentState.items.length} => ${playlistItems.length}`
            );
            changesDetected = true;
          } else {
            // Comparaison détaillée de chaque élément
            for (let i = 0; i < playlistItems.length; i++) {
              const newItem = playlistItems[i];
              const oldItem = currentState.items[i];

              // Vérification ID et position
              if (
                newItem.id !== oldItem.id ||
                newItem.position !== oldItem.position
              ) {
                console.log(
                  `Changement d'ID ou position détecté dans la playlist ${mode.playlist_id}`
                );
                changesDetected = true;
                break;
              }

              // Vérification média
              if (
                (newItem.media && !oldItem.media) ||
                (!newItem.media && oldItem.media) ||
                (newItem.media &&
                  oldItem.media &&
                  newItem.media.id !== oldItem.media.id)
              ) {
                console.log(
                  `Changement de média détecté dans la playlist ${mode.playlist_id}`
                );
                changesDetected = true;
                break;
              }

              // Vérification données
              if (
                (newItem.data && !oldItem.data) ||
                (!newItem.data && oldItem.data) ||
                (newItem.data &&
                  oldItem.data &&
                  newItem.data.id !== oldItem.data.id)
              ) {
                console.log(
                  `Changement de données détecté dans la playlist ${mode.playlist_id}`
                );
                changesDetected = true;
                break;
              }

              // Vérification de la durée
              if (newItem.duration !== oldItem.duration) {
                console.log(
                  `Changement de durée détecté dans la playlist ${mode.playlist_id}`
                );
                changesDetected = true;
                break;
              }

              // Vérification contenu du média
              if (newItem.media && oldItem.media) {
                // Comparer tous les champs pertinents du média
                const newMediaStr = JSON.stringify({
                  path: newItem.media.path,
                  type: newItem.media.type,
                  file_name: newItem.media.file_name,
                  size: newItem.media.size,
                });

                const oldMediaStr = JSON.stringify({
                  path: oldItem.media.path,
                  type: oldItem.media.type,
                  file_name: oldItem.media.file_name,
                  size: oldItem.media.size,
                });

                if (newMediaStr !== oldMediaStr) {
                  console.log(
                    `Changement dans les propriétés du média détecté dans la playlist ${mode.playlist_id}`
                  );
                  changesDetected = true;
                  break;
                }
              }

              // Vérification contenu des données
              if (newItem.data && oldItem.data) {
                // Comparer tous les champs pertinents des données
                const newDataStr = JSON.stringify({
                  value: newItem.data.value,
                  backgroundColor: newItem.data.backgroundColor,
                  type: newItem.data.type,
                });

                const oldDataStr = JSON.stringify({
                  value: oldItem.data.value,
                  backgroundColor: oldItem.data.backgroundColor,
                  type: oldItem.data.type,
                });

                if (newDataStr !== oldDataStr) {
                  console.log(
                    `Changement dans les propriétés des données détecté dans la playlist ${mode.playlist_id}`
                  );
                  changesDetected = true;
                  break;
                }
              }
            }
          }

          if (changesDetected) {
            console.log(
              `Mise à jour de l'état de la playlist ${mode.playlist_id}`
            );

            // Mettre à jour l'état
            currentState.items = playlistItems;
            currentState.lastUpdated = Date.now();

            // Réinitialiser à l'index actuel (ne pas redémarrer à 0)
            // Si l'élément actuel n'existe plus, revenir à 0
            if (currentState.currentIndex >= playlistItems.length) {
              currentState.currentIndex = 0;
            }

            // Annuler tout timeout existant
            if (currentState.timeoutId) {
              clearTimeout(currentState.timeoutId);
            }

            // Reprogrammer le prochain élément
            scheduleNextItem(mode.playlist_id);
          }
        } else if (playlistItems.length > 0) {
          // Nouvelle playlist détectée
          console.log(`Nouvelle playlist détectée: ${mode.playlist_id}`);
          changesDetected = true;

          // Initialiser l'état
          playlistStates.set(mode.playlist_id, {
            currentIndex: 0,
            items: playlistItems,
            lastChange: Date.now(),
            playlistId: mode.playlist_id,
            modeName: mode.name,
            lastUpdated: Date.now(),
          });

          // Planifier le prochain élément
          scheduleNextItem(mode.playlist_id);
        }
      } catch (error) {
        console.error(
          `Erreur lors de la vérification de la playlist ${mode.playlist_id}:`,
          error
        );
      }
    }
  }

  // Si des changements ont été détectés, notifier tous les clients
  if (changesDetected) {
    const newState = await getCurrentState();
    console.log("Envoi des nouveaux états aux clients...");
    server.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify(newState));
      }
    });
  }
}

// Fonction pour obtenir l'état actuel de toutes les playlists
async function getCurrentState() {
  const modes = await prisma.mode.findMany();
  const items: PlaylistItemToSend[] = [];

  for (const mode of modes) {
    // Vérifier si le mode est de type 'playlist' ou 'test'
    if (
      (mode.name === "playlist" || mode.name === "test") &&
      mode.playlist_id
    ) {
      let currentState = playlistStates.get(mode.playlist_id);

      // Si cette playlist n'a pas encore d'état, initialiser
      if (!currentState) {
        const items = await prisma.playlistItem.findMany({
          where: { playlist_id: mode.playlist_id },
          orderBy: { position: "asc" },
          include: { media: true, data: true },
        });

        if (items.length > 0) {
          currentState = {
            currentIndex: 0,
            items: items,
            lastChange: Date.now(),
            playlistId: mode.playlist_id,
            modeName: mode.name, // Stocker le type de mode (playlist ou test)
            lastUpdated: Date.now(),
          };

          playlistStates.set(mode.playlist_id, currentState);

          // Planifier le passage au prochain élément
          scheduleNextItem(mode.playlist_id);
        }
      }

      if (currentState && currentState.items.length > 0) {
        const currentItem = currentState.items[currentState.currentIndex];

        // Déterminer le type de contenu
        const hasMedia =
          currentItem.media !== null && currentItem.media !== undefined;
        const hasData =
          currentItem.data !== null && currentItem.data !== undefined;

        // Préparer l'élément à envoyer avec prise en compte du type de mode
        const itemToSend: PlaylistItemToSend = {
          modeId: mode.id,
          modeName: mode.name, // 'playlist' ou 'test'
          playlistId: mode.playlist_id,
          currentItem: {
            id: currentItem.id,
            position: currentItem.position,
            duration: currentItem.duration,
            contentType: hasMedia ? "media" : "data", // Indiquer explicitement le type
            media: hasMedia ? currentItem.media : undefined,
            data: hasData ? currentItem.data : undefined,
          },
        };

        // Ajouter des données supplémentaires spécifiques au type de mode
        if (mode.name === "playlist") {
          // Configuration spécifique au mode 'playlist'
          itemToSend.isMainPlaylist = true;
        } else if (mode.name === "test") {
          // Configuration spécifique au mode 'test'
          itemToSend.isTestMode = true;
        }

        items.push(itemToSend);
      }
    }
  }

  return { items };
}

// Fonction pour passer à l'élément suivant
function scheduleNextItem(playlistId: number) {
  const state = playlistStates.get(playlistId);
  if (!state) return;

  // Annuler tout timeout existant pour éviter les doublons
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
  }

  const currentItem = state.items[state.currentIndex];
  // Ajuster la durée en fonction du type de mode
  let duration = currentItem.duration * 1000; // convertir en millisecondes

  // Pour le mode 'test', on pourrait vouloir une durée différente
  if (state.modeName === "test") {
    // Exemple: durée plus courte pour le mode test
    duration = Math.min(duration, 5000); // maximum 5 secondes en mode test
  }

  // Stocker l'ID du timeout pour pouvoir l'annuler si nécessaire
  state.timeoutId = setTimeout(async () => {
    // Passer à l'élément suivant
    state.currentIndex = (state.currentIndex + 1) % state.items.length;
    state.lastChange = Date.now();

    // Notifier tous les clients connectés du changement
    const newState = await getCurrentState();
    server.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify(newState));
      }
    });

    // Planifier le prochain changement
    scheduleNextItem(playlistId);
  }, duration);
}

// Démarrer l'intervalle de vérification des changements
setInterval(checkForDatabaseChanges, DB_CHECK_INTERVAL);

// Gérer les nouvelles connexions
server.on("connection", async (ws) => {
  console.log("Client connecté");

  try {
    // Envoyer l'état actuel au nouveau client UNE SEULE FOIS
    const currentState = await getCurrentState();
    ws.send(JSON.stringify(currentState));
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'état initial:", error);
    ws.send("Erreur lors de la récupération des données\n");
  }

  ws.on("close", () => {
    console.log("Client déconnecté");
  });

  ws.on("error", (err) => {
    console.error("Erreur WebSocket:", err);
  });
});

// Initialiser les états des playlists au démarrage
(async () => {
  try {
    await getCurrentState();
    console.log("États des playlists initialisés");
    console.log(
      `Vérification des changements de base de données toutes les ${
        DB_CHECK_INTERVAL / 1000
      } secondes`
    );
  } catch (error) {
    console.error("Erreur lors de l'initialisation des états:", error);
  }
})();

// Exporter le serveur pour pouvoir le fermer proprement
export { server };

console.log(`Serveur WebSocket démarré sur le port ${port}`);
