import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import PollIcon from '@mui/icons-material/Poll';
import { IconButton, Stack, Typography } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import Container from '../../../components/ContainerComponents';
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
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
};

function EditorComponents() {
  return (
    <>
      <Container
        icon={<DataIcon />}
        title={<DataDetailsTittle />}
        content={ContentEditor()}
        headerLeft={DataDetailsClose()}
      />
    </>
  );
}

function DataIcon() {
  return <PollIcon sx={{ color: 'primary.light' }} />;
}

function DataDetailsTittle() {
  const { selectedData } = useData();
  return (
    <Stack direction="row" alignItems="center" spacing={0}>
      <Typography variant="h6">{selectedData.name}</Typography>
      <IconButton>
        <EditIcon sx={{ color: 'secondary.main' }} />
      </IconButton>
    </Stack>
  );
}

function DataDetailsClose() {
  const { clearSelectedData } = useData();
  return (
    <IconButton
      className="headerButton"
      onClick={() => {
        clearSelectedData(null);
      }}
    >
      <ArrowBackIcon sx={{ color: 'secondary.main' }} />
    </IconButton>
  );
}

function ContentEditor() {
  const { selectedData } = useData();
  let content;
  if (selectedData?.length > 0) {
    content = selectedData?.[0]?.value; // Conversion des données JSON en contenu
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
      const editorHeight = editor.view.dom.clientHeight;

      const maxHeight = parseInt(process.env.PREVIEW_HEIGHT);
      console.log('Editor height:', editorHeight, 'Max height:', maxHeight);
      if (editorHeight >= maxHeight) {
        console.log('Event prevented');

        console.warn('Taille maximale atteinte :', maxHeight);
        return true;
      }
      return false;
    },
  });

  // Rendu du composant MenuBar et de l'éditeur de contenu
  return (
    <>
      <MenuBar editor={editor} />
      <div
        style={{
          maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
          overflow: 'hidden',
          scrollbarWidth: 'none',
        }}
      >
        <EditorContent className="fixed-editor" editor={editor} />
      </div>
    </>
  );
}

export default EditorComponents;

EditorComponents.propTypes = {
  data: PropTypes.object.isRequired,
};
