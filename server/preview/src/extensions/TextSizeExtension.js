import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textSize',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultSize: '32',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textSize: {
            default: this.options.defaultSize,
            parseHTML: element => element.style.fontSize?.replace('px', '') || this.options.defaultSize,
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
        return chain().setMark('textStyle', { textSize: this.options.defaultSize }).run();
      },
    };
  },
}); 