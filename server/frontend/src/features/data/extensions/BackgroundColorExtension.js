import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'background',

  addOptions() {
    return {
      types: ['doc'],
      defaultBackgroundColor: '#ffffff',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['doc'],
        attributes: {
          backgroundColor: {
            default: this.options.defaultBackgroundColor,
            parseHTML: (element) => {
              return element.getAttribute('data-background-color') || this.options.defaultBackgroundColor;
            },
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }
              return {
                'data-background-color': attributes.backgroundColor,
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackgroundColor: (color) => ({ commands }) => {
        // Mettre à jour le DOM
        const editorElement = document.querySelector('.tiptap-text-container');
        if (editorElement) {
          editorElement.style.backgroundColor = color;
        }

        // Mettre à jour l'attribut dans le document
        return commands.updateAttributes('doc', {
          backgroundColor: color,
        });
      },
    };
  },
}); 