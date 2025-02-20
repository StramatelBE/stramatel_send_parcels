import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect, useRef } from 'react';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import AutoTemperatureExtension from '../extensions/AutoTemperatureExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import FontFamilyExtension from '../extensions/FontFamilyExtension';
import BackgroundColorExtension from '../extensions/BackgroundColorExtension';
import useData from './useData';
import { useTranslation } from 'react-i18next';

function useEditor() {
  const { t } = useTranslation();
  const { selectedData, updateData } = useData();
  let content;

  let initialTextColor = '#ffffff';
  let initialFontFamily = 'Arial';  
  let initialBackgroundColor = '#ffffff';

  if (selectedData?.value?.length > 0) {
    content = JSON.parse(selectedData?.value);

    initialTextColor = content?.attrs?.textColor || '#ffffff';
    initialFontFamily = content?.attrs?.fontFamily || 'Arial';
    initialBackgroundColor = content?.attrs?.backgroundColor || '#ffffff';
  }

  const [color, setColor] = useState(initialTextColor);

  const editor = useTipTapEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
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
      BackgroundColorExtension.configure({
        defaultBackgroundColor: initialBackgroundColor,
      }),
      FontFamilyExtension.configure({
        defaultFont: initialFontFamily,
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: () => {
      const json = editor.getJSON();
      updateData(JSON.stringify(json));
    },
  });
  
  const handleBackgroundColorChange = (color) => {
    if (editor) {
      editor.chain().focus().setBackgroundColor(color).run();
    }
  };

  useEffect(() => {
    editor.commands.setBackgroundColor(initialBackgroundColor);
    editor.chain().focus().setColor(initialTextColor).run();
    editor.chain().focus().setFontFamily(initialFontFamily).run();
  }, [
   
  ]);



  return {
    editor,
    color,
    setColor,
    initialTextColor,
    handleBackgroundColorChange,
  };
}

export default useEditor;
