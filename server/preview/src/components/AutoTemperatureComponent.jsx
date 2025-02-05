// @AutoTemperatureComponent.jsx

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useState, useEffect } from "react";
import useSocketData from "../stores/socketDataStore";

const AutoTemperatureComponent = () => {
  const [temperature, setTemperature] = useState("20°C");

  const { socketData } = useSocketData();
  // Simulate fetching temperature from an API

  useEffect(() => {
    const temperature = socketData?.temperature;
    console.log(temperature);
    setTemperature(temperature + "°C");
  }, [socketData]);

  return (
    <NodeViewWrapper className="auto-date-component">
      <span className="label">{temperature}</span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTemperatureComponent;
