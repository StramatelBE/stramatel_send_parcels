import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AutoDateComponent = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      props.updateAttributes({
        date: new Date().toLocaleDateString(),
      });
    }, 60000); // Met à jour toutes les minutes

    return () => clearInterval(timer);
  }, [props]);

  return (
    <NodeViewWrapper className="auto-date-component">
      <span className="label" contentEditable={false}>
        {currentDate.toLocaleDateString()}
      </span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

AutoDateComponent.propTypes = {
  updateAttributes: PropTypes.func.isRequired,
};

export default AutoDateComponent;
