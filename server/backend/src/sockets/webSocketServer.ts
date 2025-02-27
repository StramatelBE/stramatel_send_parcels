import { Server } from "ws";
import { Playlist, PlaylistItem, PrismaClient } from "@prisma/client";
import { Mode } from "@prisma/client";
import WebSocket from "ws";

const port: number = parseInt(process.env.WEBSOCKET_PORT) || 8080;
const prisma = new PrismaClient();
interface sendData {
  mode: string;
  PlaylistItem: PlaylistItem | null;
  currentIndex: number;
}

// Déclarer le serveur WebSocket avant son utilisation
export const wsServer = new Server({ port });

// Variables pour la gestion de la playlist actuelle
let currentPlaylistItems: PlaylistItem[] = [];
let currentIndex = 0;
let playlistTimer: NodeJS.Timeout | null = null;
let currentPlaylistId: number | null = null;
let currentMode: Mode | null = null;
let isPlaying = false;

// Fonction appelée depuis l'extérieur (ModeService) pour notifier des changements de mode
export const handleModeUpdate = async (updatedMode: Mode) => {
  try {
    console.log("Notification de changement de mode reçue!");
    console.log(`Ancien mode: ${currentMode?.name || 'aucun'}, Nouveau mode: ${updatedMode.name}`);
    
    // Si le mode n'a pas changé, ne rien faire
    if (currentMode && 
        updatedMode.name === currentMode.name && 
        updatedMode.playlist_id === currentMode.playlist_id) {
      return;
    }
    
    // Mettre à jour le mode actuel
    currentMode = updatedMode;
    
    // Si le nouveau mode n'est pas "playlist", arrêter la lecture
    if (updatedMode.name !== "playlist") {
      stopPlaylist();
      console.log("Mode n'est pas 'playlist' - Arrêt de la lecture");
      
      // Notifier tous les clients du changement de mode
      notifyModeChange(updatedMode.name);
      return;
    }
    
    // Si le nouveau mode est "playlist" et a un ID de playlist valide
    if (updatedMode.name === "playlist" && updatedMode.playlist_id) {
      // Récupérer la nouvelle playlist
      const playlist = await prisma.playlist.findUnique({
        where: {
          id: updatedMode.playlist_id
        }
      });
      
      if (playlist) {
        // Récupérer les éléments de la nouvelle playlist
        const newPlaylistItems = await prisma.playlistItem.findMany({
          where: {
            playlist_id: playlist.id
          },
          include: {
            media: true,
            data: {
              include: {
                background: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        });
        
        if (newPlaylistItems.length > 0) {
          console.log(`Nouvelle playlist chargée: ${playlist.name} (${newPlaylistItems.length} éléments)`);
          
          // Redémarrer la playlist avec les nouveaux éléments
          startPlaylist(newPlaylistItems);
        } else {
          console.log("La playlist est vide - Aucun élément à lire");
          stopPlaylist();
        }
      } else {
        console.log("Playlist introuvable - Arrêt de la lecture");
        stopPlaylist();
      }
    }
  } catch (error) {
    console.error("Erreur lors du traitement du changement de mode:", error);
  }
};

// Fonction pour déterminer le mode basé sur le contenu de l'élément
const determineItemMode = (item: PlaylistItem): string => {
  if (!item) return "playlist";
  
  // Si l'élément a un data_id, envoyer "data" comme mode
  if (item.data_id) return "data";
  
  // Sinon, si l'élément a un media_id, envoyer "media" comme mode
  if (item.media_id) return "media";
  
  // Par défaut, retourner "playlist"
  return "playlist";
};

// Fonction appelée depuis l'extérieur (PlaylistService) pour notifier des changements dans une playlist
export const handlePlaylistUpdate = async (playlistId: number) => {
  try {
    console.log(`Notification de mise à jour de playlist reçue pour l'ID: ${playlistId}`);
    
    // Vérifier si c'est la playlist actuellement en lecture
    if (currentMode?.name === "playlist" && 
        currentMode.playlist_id === playlistId && 
        isPlaying) {
      
      console.log("La playlist en cours de lecture a été modifiée");
      
      // Récupérer les éléments mis à jour de la playlist
      const updatedPlaylistItems = await prisma.playlistItem.findMany({
        where: {
          playlist_id: playlistId
        },
        include: {
          media: true,
          data: {
            include: {
              background: true
            }
          }
        },
        orderBy: {
          position: 'asc'
        }
      });
      
      if (updatedPlaylistItems.length > 0) {
        // Mettre à jour les éléments
        currentPlaylistItems = updatedPlaylistItems;
        
        // Ajuster l'index si nécessaire
        if (currentIndex >= currentPlaylistItems.length) {
          currentIndex = 0;
        }
        
        console.log(`Playlist mise à jour: ${updatedPlaylistItems.length} éléments`);
        
        // Envoyer l'élément actuel à tous les clients
        const currentItem = currentPlaylistItems[currentIndex];
        
        // Déterminer le mode basé sur le contenu de l'élément
        const itemMode = determineItemMode(currentItem);
        
        const data: sendData = {
          mode: itemMode,
          PlaylistItem: currentItem,
          currentIndex: currentIndex
        };
        
        wsServer.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } else if (isPlaying) {
        // Si la playlist est maintenant vide mais qu'elle était en lecture
        console.log("La playlist est maintenant vide - Arrêt de la lecture");
        stopPlaylist();
        notifyModeChange(currentMode.name);
      }
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la mise à jour de playlist:", error);
  }
};

// Notifier tous les clients du changement de mode
const notifyModeChange = (modeName: string) => {
  const data = {
    mode: modeName,
    PlaylistItem: null,
    currentIndex: -1
  };
  
  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Arrêter la lecture de la playlist
const stopPlaylist = () => {
  if (playlistTimer) {
    clearTimeout(playlistTimer);
    playlistTimer = null;
  }
  
  currentPlaylistItems = [];
  currentIndex = 0;
  currentPlaylistId = null;
  isPlaying = false;
  
  console.log("Lecture de la playlist arrêtée");
};

const startPlaylist = async (playlistItems: PlaylistItem[]) => {
  if (playlistItems.length > 0) {
    // Arrêter la lecture précédente si existante
    if (playlistTimer) {
      clearTimeout(playlistTimer);
    }
    
    // Mettre à jour les variables globales
    currentPlaylistItems = playlistItems;
    currentIndex = 0;
    currentPlaylistId = playlistItems[0].playlist_id;
    isPlaying = true;
    
    // Démarrer la lecture
    playNextItem();
  }
};

// Fonction pour récupérer les éléments mis à jour de la playlist
const fetchUpdatedPlaylistItems = async () => {
  if (!currentPlaylistId) return null;
  
  try {
    return await prisma.playlistItem.findMany({
      where: {
        playlist_id: currentPlaylistId
      },
      include: {
        media: true,
        data: {
          include: {
            background: true
          }
        }
      },
      orderBy: {
        position: 'asc'
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des éléments de la playlist:", error);
    return null;
  }
};

const playNextItem = async () => {
  // Vérifier si nous sommes toujours en mode playlist
  if (!isPlaying || currentPlaylistItems.length === 0) return;
  
  // Récupérer les données les plus récentes avant de jouer l'élément
  const updatedItems = await fetchUpdatedPlaylistItems();
  if (updatedItems && updatedItems.length > 0) {
    currentPlaylistItems = updatedItems;
    // S'assurer que l'index est valide
    if (currentIndex >= currentPlaylistItems.length) {
      currentIndex = 0;
    }
  }
  
  const currentItem = currentPlaylistItems[currentIndex];
  
  // Déterminer le mode basé sur le contenu de l'élément
  const itemMode = determineItemMode(currentItem);
  
  const data: sendData = {
    mode: itemMode,
    PlaylistItem: currentItem,
    currentIndex: currentIndex
  };
  
  // Diffuser l'élément actuel à tous les clients
  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
  
  console.log(`Lecture de l'élément ${currentIndex + 1}/${currentPlaylistItems.length} - Durée: ${currentItem.duration}s - Mode: ${itemMode}`);
  
  const duration = currentItem.duration * 1000;
  
  // Planifier le passage à l'élément suivant
  playlistTimer = setTimeout(() => {
    // Vérifier à nouveau si nous sommes toujours en mode playlist
    if (!isPlaying) return;
    
    // Passer à l'élément suivant
    currentIndex = (currentIndex + 1) % currentPlaylistItems.length;
    playNextItem();
  }, duration);
};

// Fonction d'initialisation principale
const initialize = async () => {
  try {
    // Récupérer le mode initial
    const mode: Mode | null = await prisma.mode.findUnique({
      where: {
        id: 1
      }
    });
    
    currentMode = mode;
    
    // Si le mode est "playlist", démarrer la lecture
    if (mode?.name === "playlist" && mode.playlist_id) {
      console.log("Mode 'playlist' détecté - Démarrage de la lecture");
      
      const playlist = await prisma.playlist.findUnique({
        where: {
          id: mode.playlist_id
        }
      });
      
      if (playlist) {
        const playlistItems = await prisma.playlistItem.findMany({
          where: {
            playlist_id: playlist.id
          },
          include: {
            media: true,
            data: {
              include: {
                background: true
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        });
        
        if (playlistItems.length > 0) {
          console.log(`Démarrage de la playlist: ${playlist.name} (${playlistItems.length} éléments)`);
          startPlaylist(playlistItems);
        } else {
          console.log("La playlist est vide - Aucun élément à lire");
        }
      } else {
        console.log("Playlist introuvable");
      }
    } else {
      console.log(`Mode actuel: ${mode?.name || 'aucun'} - Pas de lecture de playlist`);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
};

// Démarrer le processus d'initialisation
initialize();

wsServer.on("connection", async (ws) => {
  // Envoyer l'état actuel au nouveau client
  if (currentMode) {
    if (currentMode.name === "playlist" && isPlaying && currentPlaylistItems.length > 0) {
      // Si en mode playlist et la lecture est active, envoyer l'élément actuel
      const currentItem = currentPlaylistItems[currentIndex];
      
      // Déterminer le mode basé sur le contenu de l'élément
      const itemMode = determineItemMode(currentItem);
      
      const data: sendData = {
        mode: itemMode,
        PlaylistItem: currentItem,
        currentIndex: currentIndex
      };
      ws.send(JSON.stringify(data));
    } else {
      // Si pas en mode playlist, envoyer juste le mode
      const data: sendData = {
        mode: currentMode.name,
        PlaylistItem: null,
        currentIndex: -1
      };
      ws.send(JSON.stringify(data));
    }
  }

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// Nettoyage des intervalles lors de la fermeture de l'application
process.on('SIGINT', () => {
  if (playlistTimer) clearTimeout(playlistTimer);
  console.log('Arrêt propre du serveur WebSocket');
  process.exit(0);
});

console.log(`WebSocket Server is running on port ${port}`);
