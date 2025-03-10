import { useRef } from "react";

const useWebSocket = (url, onMessage) => {
  const wsRef = useRef(null);
  const reconnectInterval = useRef(null);

  const connectWebSocket = () => {
    wsRef.current = new WebSocket(url);
    wsRef.current.onmessage = (event) => {
      if (onMessage) {
        onMessage(event);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          if (wsRef.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          } else {
            clearInterval(reconnectInterval.current);
            reconnectInterval.current = null;
          }
        }, 5000);
      }
    };
  };

  const closeWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectInterval.current) {
      clearInterval(reconnectInterval.current);
    }
  };

  return { connectWebSocket, closeWebSocket };
};

export default useWebSocket;
