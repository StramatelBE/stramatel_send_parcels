import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PollIcon from '@mui/icons-material/Poll';

import { IconButton, Stack, Typography } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import PropTypes from 'prop-types';
import Container from '../../../components/ContainerComponents';
import '../../../Global.css';

import useData from '../hooks/useData';
import { useTranslation } from 'react-i18next';
import MenuBarComponent from './MenuBarComponent';
import useEditor from '../hooks/useEditor';

function EditorComponents() {
  const { t } = useTranslation();

  return (
    <>
      <Container
        icon={<DataIcon />}
        title={<DataDetailsTittle />}
        content={ContentEditor(t)}
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
      <Typography variant="h6">{selectedData.name || ''}</Typography>
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
  const { editor } = useEditor();

  if (!editor) {
    return null;
  }

  return (
    <>
      <MenuBarComponent editor={editor} />
      <div
        className="tiptap-text-container"
        style={{
          maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
          maxWidth: `${process.env.PREVIEW_WIDTH}px`,
          minWidth: `${process.env.PREVIEW_WIDTH}px`,
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
  data: PropTypes.object,
};
