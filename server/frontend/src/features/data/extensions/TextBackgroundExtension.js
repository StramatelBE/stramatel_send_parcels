import { Extension } from '@tiptap/core';

export default Extension.create({
  name: 'textBackground',

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
          textBackground: {
            default: null,
            parseHTML: element => element.style.backgroundColor || null,
            renderHTML: attributes => {
              if (!attributes.textBackground) {
                return {};
              }
              return { style: `background-color: ${attributes.textBackground}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextBackground: color => ({ chain }) => {
        return chain().setMark('textStyle', { textBackground: color }).run();
      },
      unsetTextBackground: () => ({ chain }) => {
        return chain().setMark('textStyle', { textBackground: null }).run();
      },
    };
  },
}); 