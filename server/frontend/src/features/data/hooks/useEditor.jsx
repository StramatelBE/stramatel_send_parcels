import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTemperatureExtension from '../extensions/AutoTemperatureExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import FontFamilyExtension from '../extensions/FontFamilyExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import useData from './useData';

export default function useEditor() {
  const { t } = useTranslation();
  const { selectedData, updateData } = useData();
  let content;

  let initialTextColor = '#ffffff';
  let initialFontFamily = 'Arial';
  let initialBackgroundColor = '#000000';

  if (selectedData?.value?.length > 0) {
    content = JSON.parse(selectedData?.value);

    initialTextColor = content?.attrs?.textColor || '#ffffff';
    initialFontFamily = content?.attrs?.fontFamily || 'Arial';
    initialBackgroundColor = content?.content?.[0]?.attrs?.editorBackground || '#000000';
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
      FontFamilyExtension.configure({
        defaultFont: initialFontFamily,
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      updateData(JSON.stringify(json));
    },
  });
const handleBackgroundColor = (newColor) => {
  const editorElement = document.querySelector('.tiptap-text-container');
  editorElement.style.backgroundColor = newColor;
  const updatedData = {
    ...selectedData,
    backgroundColor: newColor
  };
  console.log(updatedData);
  
  updateData(updatedData);
}
  useEffect(() => {
    if (editor) {
      editor.chain().focus().setColor(initialTextColor).run();
      editor.chain().focus().setFontFamily(initialFontFamily).run();
        const editorElement = document.querySelector('.tiptap-text-container');
        
          editorElement.style.backgroundColor = initialBackgroundColor;
        
    }
  }, [editor, initialTextColor, initialFontFamily, initialBackgroundColor]);

  return {
    editor,
    color,
    setColor,
    initialTextColor,
    initialBackgroundColor,
    handleBackgroundColor
  };
}


