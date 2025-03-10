import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import AutoTimeComponent from '../components/extensions/AutoTimeComponent.jsx';

export default Node.create({
  name: 'autoTime',

  group: 'inline',

  inline: true,

  draggable: true,

  addAttributes() {
    return {
      time: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="auto-time"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-type': 'auto-time', ...HTMLAttributes }, 'Heure'];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AutoTimeComponent, {
      contentDOMElementTag: 'span',
    });
  },
}); 