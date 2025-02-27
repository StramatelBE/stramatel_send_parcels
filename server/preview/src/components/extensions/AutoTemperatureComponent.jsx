// @AutoTemperatureComponent.jsx

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useState, useEffect } from "react";
import useData from "../../hooks/useData";

const AutoTemperatureComponent = () => {
  const [temperature, setTemperature] = useState("20°C");
  const { getTemperature } = useData();
  // Simulate fetching temperature from an API
  const fetchTemperature = async () => {
    const temperature = await getTemperature();
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
    <NodeViewWrapper className="auto-temperature-component">
      <span className="label">{temperature}</span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTemperatureComponent;
