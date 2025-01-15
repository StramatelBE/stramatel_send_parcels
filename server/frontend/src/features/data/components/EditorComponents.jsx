import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import '../../../Global.css';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import useData from '../hooks/useData';
import TextColorExtension from '../extensions/TextColorExtension';
import PaletteIcon from '@mui/icons-material/Palette';
import { ChromePicker } from 'react-color';
import { useState } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    editor.chain().focus().setTextColor(newColor.hex).run();
    setShowColorPicker(false);
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

        {/* <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive('strike') ? 'primary' : 'default'}
        >
          <FormatStrikethroughIcon />
        </IconButton> */}

        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          color={editor.isActive('underline') ? 'primary' : 'default'}
        >
          <FormatUnderlinedIcon />
        </IconButton>
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
          onClick={() => {
            const currentDate = new Date().toLocaleDateString();
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'autoDate',
                attrs: { date: currentDate },
              })
              .run();
          }}
          color="default"
        >
          <CalendarTodayIcon />
        </IconButton>
        <IconButton
          direction="row"
          alignItems="center"
          spacing={3}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <PaletteIcon
            sx={{
              color: editor.getAttributes('textStyle').textColor || 'black',
            }}
          />
        </IconButton>

        {showColorPicker && (
          <div style={{ margin: '10px 0', position: 'absolute', zIndex: 1000 }}>
            <ChromePicker color={color} onChange={handleColorChange} />
          </div>
        )}
        <IconButton
          onClick={() => {
            const currentTime = new Date().toLocaleTimeString();
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'autoTime',
                attrs: { time: currentTime },
              })
              .run();
          }}
          color="default"
        >
          <AccessTimeIcon />
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
  console.log();

  let content;
  if (data?.length > 0) {
    content = JSON.parse(data?.[0]?.value);
    console.log(content);
  }

  const MAX_HEIGHT = process.env.PREVIEW_HEIGHT;

  // Initialisation de l'éditeur avec le contenu et les extensions
  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Placeholder.configure({
        placeholder: 'Enter your text here',
        emptyNodeClass:
          'first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      AutoDateExtension,
      AutoTimeExtension,
      TextSizeExtension,
      TextColorExtension,
    ],
    onUpdate: ({ editor }) => {
      const editorElement = document.querySelector('.fixed-editor');
      if (editorElement.scrollHeight > MAX_HEIGHT) {
        editor.commands.undo();
      } else {
        const text = editor.getJSON();
        console.log(JSON.stringify(text));
        const data = {
          id: 1,
          value: JSON.stringify(text),
        };
        console.log('data', data);
        updateData(data);
      }
    },
  });

  // Rendu du composant MenuBar et de l'éditeur de contenu
  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent
        style={{
          maxHeight: `${MAX_HEIGHT}px`,
          overflow: 'auto',
          height: `${process.env.PREVIEW_HEIGHT + 133}px`,
          width: `${process.env.PREVIEW_WIDTH}px`,
        }}
        editor={editor}
        className="fixed-editor max-width-editor"
      />
    </>
  );
}

EditorComponents.propTypes = {
  data: PropTypes.object.isRequired,
};
