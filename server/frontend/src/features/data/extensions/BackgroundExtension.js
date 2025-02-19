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
          backgroundImage: {
            default: '',
            parseHTML: (element) => element.style.backgroundImage,
            renderHTML: (attributes) => {
              return {
                style: `background-image: url(${attributes.backgroundImage}); background-size: 288px 432px;`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackground: (color, imageUrl) => () => {
        const editorElement = document.querySelector('.tiptap-text-container');
        if (editorElement) {
          editorElement.style.backgroundColor = color || '#000000';
          editorElement.style.backgroundImage = imageUrl ? `url(${imageUrl})` : '';
          if (imageUrl) {
            editorElement.style.backgroundSize = `${process.env.PREVIEW_WIDTH}px ${process.env.PREVIEW_HEIGHT}px`;
          }
        }
        return true;
      },
      getBackground: () => () => {
        const editorElement = document.querySelector('.tiptap-text-container');
        if (!editorElement) {
          return {
            backgroundColor: '#000000',
            backgroundImage: '',
          };
        }
        return {
          backgroundColor: editorElement.style.backgroundColor || '#000000',
          backgroundImage: editorElement.style.backgroundImage || '',
        };
      },
    };
  },
}); 