import { useEffect } from "react";
import useSocketData from "../stores/socketDataStore";
import useWebSocket from "../socket/useWebSocket";
import useStandby from "../hooks/useStandby";
import DataService from "../api/dataService";

const useData = () => {
  const { setSocketData } = useSocketData();
  const WEBSOCKET_URL = "ws://localhost:8080";
  const { connectWebSocket } = useWebSocket(WEBSOCKET_URL, (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      /* console.log("Données WebSocket reçues:", parsedData); */
      setSocketData(parsedData);
    } catch (error) {
      console.error("Échec d'analyse des données JSON:", error);
    }
  });

  const getTemperature = async () => {
    try {
      const response = await DataService.getOneData(1);
      // Vérifier que la réponse contient des données valides
      if (response && response.data && response.data.value) {
        // Si la valeur est déjà une température formatée, la retourner telle quelle
        // Sinon, retourner simplement la valeur numérique
        return response.data.value;
      }
      // Valeur par défaut en cas de données invalides
      return "20";
    } catch (error) {
      console.error("Erreur lors de la récupération de la température:", error);
      // Retourner une valeur par défaut en cas d'erreur
      return "20";
    }
  };

  useEffect(() => {
    console.log("Connexion au WebSocket...");
    connectWebSocket();
  }, []);

  useStandby();

  return { getTemperature };
};

export default useData;
