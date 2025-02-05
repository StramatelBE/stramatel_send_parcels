// @AutoTemperatureComponent.jsx

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useState, useEffect } from "react";
import useSocketData from "../stores/socketDataStore";

const AutoTemperatureComponent = () => {
  const [temperature, setTemperature] = useState("20°C");

  const { socketData } = useSocketData();
  // Simulate fetching temperature from an API
  const fetchTemperature = async () => {
    const temperature = await socketData?.temperature;
    console.log(temperature);
    setTemperature(temperature + "°C");
  };

  useEffect(() => {
    // Fetch temperature initially
    fetchTemperature();

    // Set interval to fetch temperature every 30 seconds
    const intervalId = setInterval(fetchTemperature, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NodeViewWrapper className="auto-date-component">
      <span className="label">{temperature}</span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTemperatureComponent;
