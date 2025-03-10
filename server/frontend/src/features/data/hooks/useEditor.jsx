import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AutoDateExtension from '../extensions/AutoDateExtension';
import AutoTemperatureExtension from '../extensions/AutoTemperatureExtension';
import AutoTimeExtension from '../extensions/AutoTimeExtension';
import FontFamilyExtension from '../extensions/FontFamilyExtension';
import TextSizeExtension from '../extensions/TextSizeExtension';
import useData from './useData';
import DataService from '../api/dataService';

export default function useEditor() {
  const { t } = useTranslation();
  const { selectedData, updateData } = useData();
  let content;
  const isUpdatingRef = useRef(false);
  const isInitialRenderRef = useRef(true);

  let initialTextColor = '#ffffff';
  let initialFontFamily = '"Arial", sans-serif';
  let initialBackgroundColor = '#000000';

  if (selectedData?.value?.length > 0) {
    content = JSON.parse(selectedData?.value);

    initialTextColor = content?.attrs?.textColor || '#ffffff';
    initialFontFamily = content?.attrs?.fontFamily || '"Arial", sans-serif';
    initialBackgroundColor = selectedData?.backgroundColor || '#000000';
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
      TextSizeExtension,
      FontFamilyExtension.configure({
        defaultFont: initialFontFamily || 'Arial',
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;

      const json = editor.getJSON();
      const updatedData = {
        ...selectedData,
        value: JSON.stringify(json),
      };
      updateData(updatedData);
    },
  });

  const handleTextColor = (newColor) => {
    if (editor) {
      editor.chain().focus().setColor(newColor).run();
      setColor(newColor);
    }
  };

  const handleBackgroundColor = (newColor) => {
    const editorElement = document.querySelector('.tiptap-text-container');
    if (editorElement) {
      editorElement.style.backgroundColor = newColor;
      const updatedData = {
        ...selectedData,
        backgroundColor: newColor,
      };
      updateData(updatedData);
    }
  };

  const uploadBackground = useCallback(
    async (file) => {
      if (!selectedData) return;

      try {
        const response = await DataService.uploadBackground(
          selectedData.id,
          file
        );

        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        throw error;
      }
    },
    [selectedData, updateData]
  );

  // Effet pour initialiser l'éditeur lors du premier rendu ou lors du changement de texte
  useEffect(() => {
    console.log('useEffect');
    if (editor && selectedData) {
      try {
        // Ne pas réinitialiser les styles si ce n'est pas le rendu initial
        // et que l'utilisateur est en train d'éditer activement
        if (!isInitialRenderRef.current && editor.isFocused) {
          return;
        }

        isUpdatingRef.current = true;

        // Appliquer les styles initiaux seulement au chargement ou au changement de texte sélectionné
        /*  editor.chain().setColor(initialTextColor).run();
        editor.chain().setFontFamily(initialFontFamily).run(); */

        const editorElement = document.querySelector('.tiptap-text-container');
        console.log(editorElement);
        if (editorElement) {
          console.log('editorElement');
          if (selectedData.background) {
            console.log('selectedData.background');
            editorElement.style.backgroundImage = `url(${process.env.FRONT_URL}${selectedData.background.path})`;
          } else {
            console.log('selectedData.background is null');
            editorElement.style.backgroundImage = null;
          }
          console.log('initialBackgroundColor');
          editorElement.style.backgroundColor = initialBackgroundColor;
        }

        // Marquer que le rendu initial est terminé
        isInitialRenderRef.current = false;

        // Permettre à nouveau les mises à jour après un court délai
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      } catch (error) {
        console.error("Erreur dans useEffect de l'éditeur:", error);
        isUpdatingRef.current = false;
        isInitialRenderRef.current = false;
      }
    }
  }, [editor, selectedData]);

  return {
    editor,
    color,
    setColor,
    handleTextColor,
    initialTextColor,
    initialBackgroundColor,
    handleBackgroundColor,
    uploadBackground,
  };
}
