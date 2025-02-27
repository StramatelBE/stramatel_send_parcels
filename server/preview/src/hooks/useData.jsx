import { useEffect } from "react";
import useSocketData from "../stores/socketDataStore";
import useWebSocket from "../socket/useWebSocket";
import useStandby from "../hooks/useStandby";

const useData = () => {
  const { setSocketData } = useSocketData();
  const WEBSOCKET_URL = "ws://localhost:8080";
  const { connectWebSocket } = useWebSocket(WEBSOCKET_URL, (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      console.log("Données WebSocket reçues:", parsedData);
      setSocketData(parsedData);
    } catch (error) {
      console.error("Échec d'analyse des données JSON:", error);
    }
  });


    const getTemperature = async () => {
    const response = await DataService.getOneData(1);
    return response.data.value;
  };

  useEffect(() => {
    console.log("Connexion au WebSocket...");
    connectWebSocket();
  }, []);

  useStandby();

  return { getTemperature };
};

export default useData;
