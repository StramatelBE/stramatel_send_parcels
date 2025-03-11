import { Extension } from '@tiptap/core';
import { EDITOR_RATIO } from '../constants/editorConstants';

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
              const baseSize = attributes.textSize || this.options.defaultSize;
              const scaledSize = Math.round(parseInt(baseSize) * EDITOR_RATIO);
              return { style: `font-size: ${scaledSize}px` };
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