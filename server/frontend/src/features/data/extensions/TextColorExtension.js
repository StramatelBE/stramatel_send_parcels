import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textColor',

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
          textColor: {
            default: '#ffffff',
            parseHTML: element => element.style.color || null,
            renderHTML: attributes => {
              if (!attributes.textColor) {
                return {};
              }
              return { style: `color: ${attributes.textColor}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextColor: color => ({ chain }) => {
        return chain().setMark('textStyle', { textColor: color }).run();
      },
      unsetTextColor: () => ({ chain }) => {
        return chain().setMark('textStyle', { textColor: null }).run();
      },
    };
  },
}); 