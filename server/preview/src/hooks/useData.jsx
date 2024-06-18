import { useEffect } from "react";
import useSocketData from "../stores/socketDataStore";

const useData = () => {
  const { setSocketData } = useSocketData();

  useEffect(() => {
    const handleUnixData = (event, newData) => {
      try {
        const parsedData = JSON.parse(newData);
        setSocketData(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON data:", error);
      }
    };

    if (window.electron && window.electron.onUnixData) {
      window.electron.onUnixData(handleUnixData);
    } else {
      console.error("window.electron.onUnixData is not defined");
    }

    return () => {
      if (window.electron && window.electron.removeListener) {
        window.electron.removeListener('unix-data', handleUnixData);
      }
    };
  }, [setSocketData]);
};

export default useData;
