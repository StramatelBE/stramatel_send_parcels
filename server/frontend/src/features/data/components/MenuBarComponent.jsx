import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import useData from '../hooks/useData';
import useEditor from '../hooks/useEditor';

const MenuBarComponent = ({ editor }) => {
  const colorTextInputRef = useRef(null);
  const backgroundColorInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { selectedData, updateBackgroundData, deleteBackgroundData } =
    useData();
  const { handleBackgroundColor } = useEditor();

  const showColorPickerInput = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  if (!editor) {
    return null;
  }

  const fonts = [
    { value: '"Arial", sans-serif', label: 'Arial' },
    { value: '"Times New Roman", serif', label: 'Times New Roman' },
    { value: '"Helvetica", Arial, sans-serif', label: 'Helvetica' },
    { value: '"Georgia", serif', label: 'Georgia' },
    { value: '"Verdana", sans-serif', label: 'Verdana' },
    { value: '"Roboto", "Helvetica Neue", Arial, sans-serif', label: 'Roboto' },
    {
      value: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      label: 'Open Sans',
    },
    { value: '"Lato", "Helvetica Neue", Arial, sans-serif', label: 'Lato' },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          alignContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <FormControl
          size="small"
          sx={{ border: 'none', width: 150, marginRight: 1 }}
        >
          <Select
            value={
              editor.getAttributes('textStyle').fontFamily ||
              '"Arial", sans-serif'
            }
            onChange={(event) => {
              editor.chain().focus().setFontFamily(event.target.value).run();
            }}
            sx={{
              boxShadow: 'none',
              '& .MuiOutlinedInput-notchedOutline': { border: 0 },
              height: '40px',
              '& .MuiSelect-select': {
                fontFamily:
                  editor.getAttributes('textStyle').fontFamily ||
                  '"Arial", sans-serif',
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
        <FormControl
          size="small"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <IconButton
            onClick={() => {
              const currentSize = parseInt(
                editor.getAttributes('textStyle').textSize || '32',
                10
              );
              const newSize = Math.max(8, currentSize - 2);
              editor.chain().setTextSize(newSize.toString()).run();
            }}
            color="default"
          >
            -
          </IconButton>
          <input
            type="text"
            value={editor.getAttributes('textStyle').textSize || '32'}
            onChange={(event) => {
              const value = event.target.value;
              if (/^\d*$/.test(value)) {
                editor.chain().setTextSize(value).run();
              }
            }}
            style={{
              color: 'default',
              fontSize: '16px',
              width: '32px',
              height: '32px',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px',
              margin: '0 2px',
              padding: '0 5px',
              backgroundColor: 'transparent',
            }}
          />
          <IconButton
            onClick={() => {
              const currentSize = parseInt(
                editor.getAttributes('textStyle').textSize || '32',
                10
              );
              const newSize = Math.min(100, currentSize + 2);
              editor.chain().setTextSize(newSize.toString()).run();
            }}
            color="default"
          >
            +
          </IconButton>
        </FormControl>
      {/*   <div
          style={{
            width: '2px',
            backgroundColor: '#ccc',
            margin: '0 8px',
            height: '30px',
          }}
        /> */}

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
          onClick={() => showColorPickerInput(colorTextInputRef)}
          color="default"
        >
          <FormatColorTextIcon
            sx={{
              color: editor.getAttributes('textStyle').color || 'white',

              borderRadius: '4px',
            }}
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
          onClick={() => showColorPickerInput(backgroundColorInputRef)}
          color="default"
        >
          <FormatColorFillIcon
            sx={{
              color: selectedData?.backgroundColor || '#000000',

              borderRadius: '4px',
            }}
          />
        </IconButton>
        <input
          ref={backgroundColorInputRef}
          type="color"
          onInput={(event) => handleBackgroundColor(event.target.value)}
          value={selectedData?.backgroundColor || '#000000'}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        {selectedData?.background ? (
          <IconButton onClick={deleteBackgroundData}>
            <DeleteIcon sx={{ color: 'text.secondary' }} />
          </IconButton>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => updateBackgroundData(event.target.files[0])}
              style={{ display: 'none' }}
            />
            <IconButton onClick={() => fileInputRef.current.click()}>
              <UploadIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </>
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
        <IconButton
          onClick={() => editor.chain().focus().insertTemperature('25°C').run()}
          color={editor.isActive('autoTemperature') ? 'primary' : 'default'}
        >
          <ThermostatIcon />
        </IconButton>
      </div>
    </div>
  );
};

MenuBarComponent.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default MenuBarComponent;
