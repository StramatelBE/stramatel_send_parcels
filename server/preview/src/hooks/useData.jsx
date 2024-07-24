import { useEffect } from "react";
import useSocketData from "../stores/socketDataStore";
import useWebSocket from "../socket/useWebSocket";
import useStandby from "../hooks/useStandby";

const useData = () => {
  const { setSocketData } = useSocketData();
  const { connectWebSocket, closeWebSocket } = useWebSocket(
    process.env.SOCKET_URL,
    (event) => {
      try {
/*         console.log(event.data); */
        const parsedData = JSON.parse(event.data);
        setSocketData(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON data:", error);
      }
    }
  );

  useEffect(() => {
    connectWebSocket();
  }, []);

  useStandby();

  return null;
};

export default useData;
