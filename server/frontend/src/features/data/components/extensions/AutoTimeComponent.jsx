// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import PropTypes from 'prop-types';

const AutoTimeComponent = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      if (newTime.getMinutes() !== currentTime.getMinutes()) {
        props.updateAttributes({
          time: newTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }
    }, 1000); // Met à jour chaque seconde

    return () => clearInterval(timer);
  }, [props, currentTime]);

  AutoTimeComponent.propTypes = {
    updateAttributes: PropTypes.func.isRequired,
  };

  return (
    <NodeViewWrapper className="auto-time-component">
      <span className="label">
        {currentTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default AutoTimeComponent;
