import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textSize: {
            default: '32',
            parseHTML: element => element.style.fontSize.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.textSize) {
                return {};
              }
              return { style: `font-size: ${attributes.textSize}px` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextSize: size => ({ chain }) => {
        return chain().setMark('textStyle', { textSize: size }).run();
      },
      unsetTextSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { textSize: '32' }).run();
      },
    };
  },
}); 