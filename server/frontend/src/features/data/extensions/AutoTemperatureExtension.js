import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import AutoTemperatureComponent from '../components/extensions/AutoTemperatureComponent';

const AutoTemperatureExtension = Node.create({
  name: 'autoTemperature',

  group: 'inline',

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      temperature: {
        default: '20°C', // Valeur par défaut
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="auto-temperature"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-type': 'auto-temperature', ...HTMLAttributes }, 'Température'];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AutoTemperatureComponent, {
      contentDOMElementTag: 'span',
    });
  },

  addCommands() {
    return {
      insertTemperature:
        (temperature) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: { temperature },
            });
          },
    };
  },
});

export default AutoTemperatureExtension;
