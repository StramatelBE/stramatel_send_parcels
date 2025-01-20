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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import TextStyle from '@tiptap/extension-text-style';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import Container from '../../../components/ContainerComponents';
import '../../../Global.css';

import useData from '../hooks/useData';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import AutoDateExtension from '../extensions/AutoDateExtension';
import TextColorExtension from '../extensions/TextColorExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import PaletteIcon from '@mui/icons-material/Palette';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import TextBackgroundExtension from '../extensions/TextBackgroundExtension';

const MenuBar = ({
  editor,
  editorBackgroundColor,
  setEditorBackgroundColor,
}) => {
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [showEditorBackgroundColorPicker, setShowEditorBackgroundColorPicker] =
    useState(false);

  if (!editor) {
    return null;
  }
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    editor.chain().focus().setTextColor(newColor.hex).run();
  };
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

        <FormControl
          size="small"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Select
            labelId="text-size-select-label"
            id="text-size-select"
            color="primary"
            value={editor.getAttributes('textStyle').textSize || '32'}
            label="Text Size"
            sx={{
              color: 'text.secondary',
              padding: 0,
              '& .MuiSelect-iconOutlined': {
                color: 'transparent',
                width: 0,
                height: 0,
              },
              '& .css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                border: 'none',
                width: 0,
                height: 0,
              },
              '& .css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
                {
                  padding: '8px 2px 8px 8px',
                },
            }}
            onChange={(event) => {
              const size = event.target.value;
              if (size === 'default') {
                editor.chain().focus().unsetTextSize().run();
              } else {
                editor.chain().focus().setTextSize(size).run();
              }
            }}
          >
            <MenuItem value="24">24</MenuItem>
            <MenuItem value="26">26</MenuItem>
            <MenuItem value="28">28</MenuItem>
            <MenuItem value="30">30</MenuItem>
            <MenuItem value="32">32</MenuItem>
            <MenuItem value="34">34</MenuItem>
            <MenuItem value="36">36</MenuItem>
            <MenuItem value="38">38</MenuItem>
            <MenuItem value="40">40</MenuItem>
            <MenuItem value="42">42</MenuItem>
            <MenuItem value="44">44</MenuItem>
            <MenuItem value="46">46</MenuItem>
            <MenuItem value="48">48</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </Select>
          <Typography variant="h8" sx={{ color: 'text.secondary' }}>
            px
          </Typography>
        </FormControl>
        <IconButton onClick={() => setShowColorPicker(!showColorPicker)}>
          <PaletteIcon
            sx={{
              color: editor.getAttributes('textStyle').textColor || 'black',
            }}
          />
        </IconButton>
        {showColorPicker && (
          <div style={{ margin: '10px 0', position: 'absolute', zIndex: 1000 }}>
            <SketchPicker
              color={color}
              onChangeComplete={(newColor) => {
                handleColorChange(newColor);
                editor.chain().focus().setTextColor(newColor.hex).run();
              }}
            />
          </div>
        )}
        <IconButton
          onClick={() =>
            setShowBackgroundColorPicker(!showBackgroundColorPicker)
          }
        >
          <PaletteIcon
            sx={{
              color:
                editor.getAttributes('textStyle').textBackground || 'black',
            }}
          />
        </IconButton>
        {showBackgroundColorPicker && (
          <div style={{ margin: '10px 0', position: 'absolute', zIndex: 1000 }}>
            <SketchPicker
              color={backgroundColor}
              onChangeComplete={(newColor) => {
                setBackgroundColor(newColor.hex);
                editor.chain().focus().setTextBackground(newColor.hex).run();
              }}
            />
          </div>
        )}
        <IconButton
          onClick={() =>
            setShowEditorBackgroundColorPicker(!showEditorBackgroundColorPicker)
          }
        >
          <PaletteIcon sx={{ color: editorBackgroundColor }} />
        </IconButton>
        {showEditorBackgroundColorPicker && (
          <div style={{ margin: '10px 0', position: 'absolute', zIndex: 1000 }}>
            <SketchPicker
              color={editorBackgroundColor}
              onChangeComplete={(newColor) => {
                setEditorBackgroundColor(newColor.hex);
              }}
            />
          </div>
        )}
        <FormControl size="small">
          <Select
            variant="outlined"
            sx={{
              padding: 0,
              '& .MuiSelect-iconOutlined': {
                color: 'transparent',
                width: 0,
                height: 0,
              },
              '& .css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                border: 'none',
                width: 0,
                height: 0,
              },
              '& .css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-1aagvc8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
                {
                  padding: '8px',
                },
            }}
            value={
              editor.isActive({ textAlign: 'right' })
                ? 'right'
                : editor.isActive({ textAlign: 'center' })
                ? 'center'
                : 'left'
            }
            label="Text Align"
            onChange={(event) => {
              const align = event.target.value;
              editor.chain().focus().setTextAlign(align).run();
            }}
          >
            <MenuItem value="left">
              <FormatAlignLeftIcon sx={{ color: 'text.secondary' }} />
            </MenuItem>
            <MenuItem value="center">
              <FormatAlignCenterIcon sx={{ color: 'text.secondary' }} />
            </MenuItem>
            <MenuItem value="right">
              <FormatAlignRightIcon sx={{ color: 'text.secondary' }} />
            </MenuItem>
          </Select>
        </FormControl>
        <IconButton
          onClick={() =>
            editor.chain().focus().insertContent({ type: 'autoDate' }).run()
          }
          color={editor.isActive('autoDate') ? 'primary' : 'default'}
        >
          <CalendarTodayIcon />
        </IconButton>
        <IconButton
          onClick={() =>
            editor.chain().focus().insertContent({ type: 'autoTime' }).run()
          }
          color={editor.isActive('autoTime') ? 'primary' : 'default'}
        >
          <AccessTimeIcon />
        </IconButton>
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
  editorBackgroundColor: PropTypes.string.isRequired,
  setEditorBackgroundColor: PropTypes.func.isRequired,
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
      TextStyle,
      Placeholder.configure({
        placeholder: 'Enter your text here', // Texte de l'espace réservé
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Types de nœuds auxquels appliquer l'alignement du texte
      }),
      AutoDateExtension,
      AutoTimeExtension,
      TextSizeExtension.configure({
        defaultSize: '32px',
      }),
      TextColorExtension,
      TextBackgroundExtension,
    ],
  });

  const [editorBackgroundColor, setEditorBackgroundColor] = useState('#ffffff');

  // Rendu du composant MenuBar et de l'éditeur de contenu
  return (
    <>
      <MenuBar
        editor={editor}
        editorBackgroundColor={editorBackgroundColor}
        setEditorBackgroundColor={setEditorBackgroundColor}
      />
      <div
        className="tiptap-text-container"
        style={{
          maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
          overflow: 'hidden',
          scrollbarWidth: 'none',
          backgroundColor: editorBackgroundColor,
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
