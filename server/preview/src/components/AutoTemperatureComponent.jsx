// @AutoTemperatureComponent.jsx

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import useSocketData from "../stores/socketDataStore";

const AutoTemperatureComponent = () => {
  const { socketData } = useSocketData();
  // Simulate fetching temperature from an API

  return (
    <NodeViewWrapper className="auto-date-component">
      <span className="label">{socketData?.temperature + "°C" || "---°C"}</span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTemperatureComponent;
