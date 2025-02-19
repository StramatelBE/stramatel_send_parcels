import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import PaletteIcon from '@mui/icons-material/Palette';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import useData from '../hooks/useData';
import useEditor from '../hooks/useEditor';

const MenuBarComponent = ({
  editor,

  fontFamily,
}) => {
  const colorTextInputRef = useRef(null);
  const colorBackgroundInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { selectedData, updateBackgroundData, deleteBackgroundData } =
    useData();

  const { handleFontFamilyChange, handleBackgroundColorChange } = useEditor();

  const showColorPickerInput = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  if (!editor) {
    return null;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const updatedData = await updateBackgroundData(file);
        if (updatedData.background) {
          const backgroundPath = `${updatedData.background.path}`;
          const jsonData = JSON.parse(selectedData.value);
          const backgroundColor = jsonData.attrs?.backgroundColor || '#000000';
          editor.commands.setBackground(backgroundColor, backgroundPath);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      }
    }
  };

  const deleteBackgroundHandle = () => {
    deleteBackgroundData();
    const jsonData = JSON.parse(selectedData.value);
    const backgroundColor = jsonData.attrs?.backgroundColor || '#000000';
    editor.commands.setBackground(backgroundColor, '');
    delete jsonData.attrs.background;
  };

  const jsonData = JSON.parse(selectedData.value);
  const backgroundColor = jsonData.attrs?.backgroundColor || '#000000';
  const editorElement = document.querySelector('.tiptap-text-container');
  const backgroundImage = editorElement?.style.backgroundImage || '';
  const hasBackgroundImage = backgroundImage && backgroundImage !== 'none';

  const fonts = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
  ];

  return (
    <div className="control-group">
      <div className="button-group">
        <FormControl size="small" sx={{ minWidth: 120, marginRight: 1 }}>
          <Select
            value={fontFamily || 'Arial'}
            onChange={(event) => {
              if (
                handleFontFamilyChange &&
                typeof handleFontFamilyChange === 'function'
              ) {
                handleFontFamilyChange(event.target.value);
              }
            }}
            sx={{
              height: '40px',
              '& .MuiSelect-select': {
                fontFamily: fontFamily || 'Arial',
              },
            }}
          >
            {fonts.map((font) => (
              <MenuItem
                key={font.value}
                value={font.value}
                sx={{ fontFamily: font.value }}
              >
                {font.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            sx={{ color: editor.getAttributes('textStyle').color || 'white' }}
          />
        </IconButton>
        <input
          ref={colorTextInputRef}
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes('textStyle').color || '#ffffff'}
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
            value={backgroundColor}
            onChange={(e) => handleBackgroundColorChange(e, editor)}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <PaletteIcon sx={{ color: backgroundColor }} />
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

        {hasBackgroundImage ? (
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

MenuBarComponent.propTypes = {
  editor: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  handleTextColorChange: PropTypes.func.isRequired,
  handleBackgroundColorChange: PropTypes.func.isRequired,
  fontFamily: PropTypes.string.isRequired,
  handleFontFamilyChange: PropTypes.func.isRequired,
};

export default MenuBarComponent;
