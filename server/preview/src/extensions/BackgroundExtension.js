import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'background',

  addOptions() {
    return {
      types: ['background'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['doc'],
        attributes: {
          backgroundColor: {
            default: '#ffffff',
            parseHTML: (element) => element.style.backgroundColor,
            renderHTML: (attributes) => {
              return {
                style: `background-color: ${attributes.backgroundColor};`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackground: (color) => () => {
        const editorElement = document.querySelector('.tiptap-text-container');
        if (editorElement) {
          editorElement.style.backgroundColor = color;
        }
        return true;
      },
    };
  },
}); 