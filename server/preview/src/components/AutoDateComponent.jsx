import React, { useEffect, useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const AutoDateComponent = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      props.updateAttributes({
        date: new Date().toLocaleDateString("fr-FR"),
      });
    }, 60000); // Met à jour toutes les minutes

    return () => clearInterval(timer);
  }, [props]);

  return (
    <NodeViewWrapper className="auto-date-component">
      <span className="label" contentEditable={false}>
        {currentDate.toLocaleDateString("fr-FR")}
      </span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoDateComponent;
