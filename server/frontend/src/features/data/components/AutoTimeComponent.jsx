import React, { useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const AutoTimeComponent = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      props.updateAttributes({
        time: new Date().toLocaleTimeString(),
      });
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(timer);
  }, [props]);

  return (
    <NodeViewWrapper className="auto-time-component">
      <span className="label" contentEditable={false}>
        {currentTime.toLocaleTimeString()}
      </span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTimeComponent;
