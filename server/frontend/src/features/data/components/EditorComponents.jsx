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
  if (data?.length > 0) {
    content = JSON.parse(data?.[0]?.value); // Conversion des données JSON en contenu
  }

  // Initialisation de l'éditeur avec le contenu et les extensions
  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Enter your text here', // Texte de l'espace réservé
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Types de nœuds auxquels appliquer l'alignement du texte
      }),
    ],
    onUpdate: ({ editor }) => {
      const currentHeight =
        document.querySelector('.fixed-editor').scrollHeight;
      const text = editor.getJSON();
      console.log(currentHeight, text);
    },
  });

  // Rendu du composant MenuBar et de l'éditeur de contenu
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
