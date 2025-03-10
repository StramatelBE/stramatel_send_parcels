import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import AutoDateComponent from '../components/extensions/AutoDateComponent';

export default Node.create({
  name: 'autoDate',

  group: 'inline',

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      date: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="auto-date"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-type': 'auto-date', ...HTMLAttributes }, 'Date'];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AutoDateComponent, {
      contentDOMElementTag: 'span',
    });
  },
}); 