import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { IconButton } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import '../../../Global.css';
import useData from '../hooks/useData';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive('bold') ? 'primary' : 'default'}
        >
          <FormatBoldIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive('italic') ? 'primary' : 'default'}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive('strike') ? 'primary' : 'default'}
        >
          <FormatStrikethroughIcon />
        </IconButton>

        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          color={editor.isActive('underline') ? 'primary' : 'default'}
        >
          <FormatUnderlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          color={editor.isActive('left') ? 'primary' : 'default'}
        >
          <FormatAlignLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          color={editor.isActive('center') ? 'primary' : 'default'}
        >
          <FormatAlignCenterIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          color={editor.isActive('right') ? 'primary' : 'default'}
        >
          <FormatAlignRightIcon />
        </IconButton>

        {/* <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button> */}
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default function EditorComponents({ data }) {
  const { updateData } = useData();

  const maxCharsPerLine = 5; // Limite de caractères par ligne
  const maxHeight = 432; // Limite de hauteur en pixels
  let content;
  if (data) {
    console.log('data', data);
    content = JSON.parse(data?.[0]?.value);
  }
  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Enter your text here',
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: ({ editor }) => {
      const editorElement = document.querySelector('.fixed-editor');
      const currentHeight = editorElement.scrollHeight;

      const { from, to } = editor.state.selection;
      const text = editor.getJSON();

      if (currentHeight > maxHeight) {
        console.warn(
          'La hauteur maximale est atteinte. Le contenu ne peut pas être ajouté.'
        );

        const lastNode = text.content[text.content.length - 1];
        if (lastNode && lastNode.type === 'paragraph') {
          if (lastNode.content) {
            const lastTextNode = lastNode.content[lastNode.content.length - 1];
            if (lastTextNode && lastTextNode.type === 'text') {
              lastTextNode.text = lastTextNode.text.slice(0, maxCharsPerLine);
            }
          } else {
            text.content.pop();
          }
        }

        editor.commands.setContent(text);
        return;
      }
      const newContent = text.content
        .map((node) => {
          if (node.type === 'paragraph' && node.content) {
            const newParagraphs = [];
            const textAlign = node.attrs?.textAlign || null;

            node.content.forEach((textNode) => {
              if (textNode.type === 'text') {
                let text = textNode.text;
                while (text.length > maxCharsPerLine) {
                  const newTextNode = {
                    ...textNode,
                    text: text.slice(0, maxCharsPerLine),
                  };
                  newParagraphs.push({
                    type: 'paragraph',
                    attrs: { textAlign },
                    content: [newTextNode],
                  });
                  text = text.slice(maxCharsPerLine);
                }
                if (text.length > 0) {
                  const remainingTextNode = {
                    ...textNode,
                    text: text,
                  };
                  newParagraphs.push({
                    type: 'paragraph',
                    attrs: { textAlign },
                    content: [remainingTextNode],
                  });
                }
              }
            });
            return newParagraphs;
          }
          return [node];
        })
        .flat();

      const newDoc = {
        type: 'doc',
        content: newContent,
      };
      // Restaurer la position du curseur si il n'y a pas 5 caractères

      editor.commands.setContent(newDoc);
      const data = { id: 1, value: JSON.stringify(newDoc) };
      updateData(data);
      if (
        text.content[text.content.length - 1].content[0].text.length <=
        maxCharsPerLine
      ) {
        editor.view.dispatch(
          editor.state.tr.setSelection(
            editor.state.selection.constructor.create(
              editor.state.doc,
              from,
              to
            )
          )
        );
      }
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="fixed-editor max-width-editor"
      />
    </>
  );
}

EditorComponents.propTypes = {
  data: PropTypes.object.isRequired,
};
