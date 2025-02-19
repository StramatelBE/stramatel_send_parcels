import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect, useCallback, useRef } from 'react';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import AutoTemperatureExtension from '../extensions/AutoTemperatureExtension';
import BackgroundExtension from '../extensions/BackgroundExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import FontFamilyExtension from '../extensions/FontFamilyExtension';
import useData from './useData';
import { useTranslation } from 'react-i18next';

function useEditor() {
  const { t } = useTranslation();
  const { selectedData, updateData } = useData();
  const isUpdatingRef = useRef(false);
  let content;
  let initialBackgroundColor = '#000000';
  let initialTextColor = '#ffffff';
  let initialFontFamily = 'Arial';

  if (selectedData?.value?.length > 0) {
    content = JSON.parse(selectedData?.value);
    initialBackgroundColor = content?.attrs?.backgroundColor || '#000000';
    initialTextColor = content?.attrs?.textColor || '#ffffff';
    initialFontFamily = content?.attrs?.fontFamily || 'Arial';
  }

  const [color, setColor] = useState(initialTextColor);
  const [fontFamily, setFontFamily] = useState(initialFontFamily);

  const editor = useTipTapEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
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
      BackgroundExtension.configure({
        defaultBackgroundColor: initialBackgroundColor,
      }),
      FontFamilyExtension.configure({
        defaultFont: initialFontFamily,
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;

      const data = { ...selectedData };
      const jsonContent = editor.getJSON();

      if (!jsonContent.attrs) {
        jsonContent.attrs = {};
      }

      const currentAttrs = JSON.parse(selectedData.value)?.attrs || {};
      jsonContent.attrs = {
        ...currentAttrs,
        ...jsonContent.attrs,
      };

      data.value = JSON.stringify(jsonContent);
      updateData(data);
    },
  });
  /* 
  const handleTextColorChange = useCallback(
    (event, editor, setColor) => {
      const newColor = event.target.value;
      if (!editor || !newColor) return;

      isUpdatingRef.current = true;
      setColor(newColor);
      editor.chain().focus().setColor(newColor).run();

      const jsonData = JSON.parse(selectedData.value);
      if (!jsonData.attrs) {
        jsonData.attrs = {};
      }

      jsonData.attrs.textColor = newColor;
      const newEditorData = {
        ...selectedData,
        value: JSON.stringify(jsonData),
      };
      updateData(newEditorData);

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [selectedData, updateData]
  ); */

  const handleBackgroundColorChange = useCallback(
    (event, editor) => {
      const newColor = event.target.value;
      if (!editor || !newColor) return;

      isUpdatingRef.current = true;
      editor.commands.setBackground(newColor);

      const jsonData = JSON.parse(selectedData.value);
      if (!jsonData.attrs) {
        jsonData.attrs = {};
      }
      jsonData.attrs.backgroundColor = newColor;
      const newEditorData = {
        ...selectedData,
        value: JSON.stringify(jsonData),
      };
      updateData(newEditorData);

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [selectedData, updateData]
  );

  const handleFontFamilyChange = useCallback(
    (newFont) => {
      if (!editor || !newFont || newFont === fontFamily) return;

      isUpdatingRef.current = true;
      setFontFamily(newFont);
      editor.chain().focus().setFontFamily(newFont).run();

      const jsonData = JSON.parse(selectedData.value);
      if (!jsonData.attrs) {
        jsonData.attrs = {};
      }

      jsonData.attrs.fontFamily = newFont;
      const newEditorData = {
        ...selectedData,
        value: JSON.stringify(jsonData),
      };
      updateData(newEditorData);

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
    [editor, fontFamily, selectedData, updateData]
  );

  useEffect(() => {
    if (!editor || isUpdatingRef.current) return;

    editor.commands.setBackground(initialBackgroundColor);
    editor.chain().focus().setColor(initialTextColor).run();
    editor.chain().focus().setFontFamily(initialFontFamily).run();

    if (selectedData?.background) {
      const backgroundPath = `${selectedData.background.path}`;
      editor.commands.setBackground(initialBackgroundColor, backgroundPath);
    }
  }, [
    editor,
    selectedData?.background,
    initialBackgroundColor,
    initialTextColor,
    initialFontFamily,
  ]);

  return {
    editor,
    color,
    setColor,
    fontFamily,
    handleFontFamilyChange,

    handleBackgroundColorChange,
    initialBackgroundColor,
    initialTextColor,
  };
}

export default useEditor;
