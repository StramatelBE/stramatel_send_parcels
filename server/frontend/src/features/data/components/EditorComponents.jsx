import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import PollIcon from '@mui/icons-material/Poll';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

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
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PropTypes from 'prop-types';
import Container from '../../../components/ContainerComponents';
import '../../../Global.css';

import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import PaletteIcon from '@mui/icons-material/Palette';
import { useEffect, useRef, useState } from 'react';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import AutoTemperatureExtension from '../extensions/AutoTemperatureExtension';
import BackgroundExtension from '../extensions/BackgroundExtension';
import TextColorExtension from '../extensions/TextColorExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import useData from '../hooks/useData';
import { useTranslation } from 'react-i18next';

const MenuBar = ({
  editor,
  color,
  setColor,
  editorBackgroundColor,
  setEditorBackgroundColor,
  setEditorBackgroundImage,
  editorBackgroundImage,
}) => {
  const colorTextInputRef = useRef(null);
  const colorBackgroundInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { selectedData, updateData, updateBackgroundData } = useData();

  const handleTextColorChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    editor.chain().focus().setTextColor(newColor).run();
    const jsonData = JSON.parse(selectedData.value);

    if (!jsonData.attrs) {
      jsonData.attrs = {};
    }

    jsonData.attrs.textColor = newColor;
    const newEditorData = { ...selectedData, value: JSON.stringify(jsonData) };
    updateData(newEditorData);
  };
  const showColorPickerInput = (ref) => {
    if (ref.current) {
      ref.current.click(); // Simuler un clic sur l'input
    }
  };
  if (!editor) {
    return null;
  }
  const handleBackgroundColorChange = (event) => {
    setEditorBackgroundColor(event.target.value);
    editor.commands.setBackground(event.target.value);
    const jsonData = JSON.parse(selectedData.value);

    if (!jsonData.attrs) {
      jsonData.attrs = {};
    }

    jsonData.attrs.backgroundColor = event.target.value;
    const newEditorData = { ...selectedData, value: JSON.stringify(jsonData) };
    updateData(newEditorData);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const updatedData = await updateBackgroundData(file);
        if (updatedData.background) {
          const backgroundPath = `${updatedData.background.path}`;
          setEditorBackgroundImage(backgroundPath);
          editor.commands.setBackground(editorBackgroundColor, backgroundPath);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      }
    }
  };

  const deleteBackgroundHandle = () => {
    updateData({
      id: selectedData.id,
      background_id: null,
    });
    setEditorBackgroundImage('');
    editor.commands.setBackground(editorBackgroundColor, '');
    const jsonData = JSON.parse(selectedData.value);
    delete jsonData.attrs.background;
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
        <IconButton
          onClick={() => showColorPickerInput(colorTextInputRef)}
          color="default"
        >
          <FormatColorTextIcon
            sx={{ color: editor.getAttributes('textStyle').textColor }}
          />
        </IconButton>
        <input
          ref={colorTextInputRef}
          type="color"
          value={color}
          onChange={handleTextColorChange}
          style={{
            position: 'absolute',

            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        <IconButton
          onClick={() => showColorPickerInput(colorBackgroundInputRef)}
        >
          <input
            ref={colorBackgroundInputRef}
            type="color"
            value={editorBackgroundColor}
            onChange={handleBackgroundColorChange}
            style={{
              position: 'absolute',

              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <PaletteIcon sx={{ color: editorBackgroundColor }} />
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
        <IconButton
          onClick={() => editor.chain().focus().insertTemperature('25°C').run()}
          color={editor.isActive('autoTemperature') ? 'primary' : 'default'}
        >
          <ThermostatIcon />
        </IconButton>
        {editorBackgroundImage ? (
          <IconButton onClick={deleteBackgroundHandle}>
            <DeleteIcon sx={{ color: 'text.secondary' }} />
          </IconButton>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <IconButton onClick={() => fileInputRef.current.click()}>
              <UploadIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object.isRequired,
  editorBackgroundColor: PropTypes.string.isRequired,
  setEditorBackgroundColor: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  editorBackgroundImage: PropTypes.string.isRequired,
  setEditorBackgroundImage: PropTypes.func.isRequired,
};

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

function ContentEditor(t) {
  const { selectedData, updateData } = useData();
  let content;

  if (selectedData?.value?.length > 0) {
    content = JSON.parse(selectedData?.value);
  }

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Placeholder.configure({
        placeholder: t('editor.placeholder'),
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      AutoDateExtension,
      AutoTimeExtension,
      TextSizeExtension.configure({
        defaultSize: '32px',
      }),
      TextColorExtension.configure({
        defaultColor: '#ffffff',
      }),
      BackgroundExtension.configure({
        defaultBackgroundColor: '#000000',
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: ({ editor }) => {
      const data = { ...selectedData, value: editor.getJSON() };
      data.value.attrs.backgroundColor = editorBackgroundColor;
      data.value = JSON.stringify(data.value);
      updateData(data);
    },
  });

  const [color, setColor] = useState('#ffffff');
  const [editorBackgroundColor, setEditorBackgroundColor] = useState(
    content?.attrs?.backgroundColor || '#000000'
  );
  const [editorBackgroundImage, setEditorBackgroundImage] = useState('');

  useEffect(() => {
    if (editor && selectedData?.background) {
      const backgroundPath = `${selectedData.background.path}`;
      setEditorBackgroundImage(backgroundPath);
      editor.commands.setBackground(editorBackgroundColor, backgroundPath);
    }
  }, [editor, selectedData, editorBackgroundColor]);

  return (
    <>
      <MenuBar
        editor={editor}
        editorBackgroundColor={editorBackgroundColor}
        setEditorBackgroundColor={setEditorBackgroundColor}
        editorBackgroundImage={editorBackgroundImage}
        setEditorBackgroundImage={setEditorBackgroundImage}
        color={color}
        setColor={setColor}
      />
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
