import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor as useTipTapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import AutoDateExtension from "../extensions/AutoDateExtension";
import AutoTemperatureExtension from "../extensions/AutoTemperatureExtension";
import AutoTimeExtension from "../extensions/AutoTimeExtension";
import FontFamilyExtension from "../extensions/FontFamilyExtension";
import TextSizeExtension from "../extensions/TextSizeExtension";
import { EDITOR_RATIO } from "../constants/editorConstants";

// Taille de base pour le texte (sera multipliée par le ratio)
const BASE_TEXT_SIZE = 24;

export default function useEditor({ data }) {
  const isUpdatingRef = useRef(false);
  const isInitialRenderRef = useRef(true);

  // Utiliser useState pour stocker les valeurs qui doivent être réactives
  const [editorContent, setEditorContent] = useState(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState('"Arial", sans-serif');
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [color, setColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(Math.round(BASE_TEXT_SIZE * EDITOR_RATIO).toString());

  // Mettre à jour les états lorsque data change
  useEffect(() => {
    try {
      if (data?.value?.length > 0) {
        console.log("data.value", data.value);
        const parsedContent = JSON.parse(data.value);
        
        // Vérifier si le contenu JSON contient des informations de taille
        let hasTextSizeInfo = false;
        
        // Fonction récursive pour vérifier les informations de taille dans le contenu
        const checkForTextSize = (node) => {
          if (!node) return false;
          
          // Vérifier les marques pour trouver textSize
          if (node.marks && Array.isArray(node.marks)) {
            for (const mark of node.marks) {
              if (mark.type === 'textStyle' && mark.attrs && mark.attrs.textSize) {
                hasTextSizeInfo = true;
                return true;
              }
            }
          }
          
          // Vérifier dans le contenu enfant
          if (node.content && Array.isArray(node.content)) {
            for (const child of node.content) {
              if (checkForTextSize(child)) return true;
            }
          }
          
          return false;
        };
        
        // Vérifier si le contenu a des informations de taille
        if (parsedContent.content) {
          parsedContent.content.forEach(checkForTextSize);
        }
        
        console.log("Content has text size information:", hasTextSizeInfo);
        
        setEditorContent(parsedContent);
        setTextColor(parsedContent?.attrs?.textColor || "#ffffff");
        setFontFamily(
          parsedContent?.attrs?.fontFamily || '"Arial", sans-serif'
        );
        setBackgroundColor(data?.backgroundColor || "#000000");
        setColor(parsedContent?.attrs?.textColor || "#ffffff");
        
        // Si aucune information de taille n'est trouvée, utiliser la taille de base avec ratio
        if (!hasTextSizeInfo) {
          setTextSize(Math.round(BASE_TEXT_SIZE * EDITOR_RATIO).toString());
        }
      } else {
        setEditorContent(null);
        setTextColor("#ffffff");
        setFontFamily('"Arial", sans-serif');
        setBackgroundColor("#000000");
        setColor("#ffffff");
        setTextSize(Math.round(BASE_TEXT_SIZE * EDITOR_RATIO).toString());
      }
    } catch (error) {
      console.error("Erreur lors du traitement des données:", error);
    }
  }, [data]);

  // Créer l'éditeur avec les valeurs d'état actuelles
  const editor = useTipTapEditor({
    content: editorContent,
    autofocus: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      AutoDateExtension,
      AutoTimeExtension,
      TextSizeExtension.configure({
        types: ['textStyle'],
        defaultSize: textSize, // Utiliser la taille calculée avec le ratio
      }),
      FontFamilyExtension.configure({
        defaultFont: fontFamily || "Arial",
      }),
      AutoTemperatureExtension,
    ],
    onUpdate: () => {
      // Optionnel: gérer les mises à jour de l'éditeur ici si nécessaire
    },
  });

  // Effet pour mettre à jour l'éditeur lorsque l'éditeur est disponible et que les données changent
  useEffect(() => {
    if (!editor) return;

    // Utiliser un setTimeout pour déplacer les opérations hors du cycle de rendu React
    // Cela résout le problème d'avertissement "flushSync was called from inside a lifecycle method"
    const timeoutId = setTimeout(() => {
      try {
        // Appliquer les styles à l'éditeur sans forcer le focus
        editor.chain().setColor(textColor).run();
        editor.chain().setFontFamily(fontFamily).run();

        // Mettre à jour le contenu de l'éditeur si nécessaire
        if (
          editorContent &&
          JSON.stringify(editor.getJSON()) !== JSON.stringify(editorContent)
        ) {
          editor.commands.setContent(editorContent);
        }

        // Mettre à jour les styles d'arrière-plan
        const editorElement = document.querySelector(".tiptap-text-container");
        if (editorElement) {
          if (data?.background?.path) {
            editorElement.style.backgroundImage = `url(${process.env.FRONT_URL}${data.background.path})`;
          } else {
            editorElement.style.backgroundImage = "none";
          }
          editorElement.style.backgroundColor = backgroundColor;
        }

        // Marquer que le rendu initial est terminé
        isInitialRenderRef.current = false;
      } catch (error) {
        console.error("Erreur dans useEffect de l'éditeur:", error);
        isUpdatingRef.current = false;
        isInitialRenderRef.current = false;
      }
    }, 0);

    // Nettoyer le timeout en cas de démontage du composant
    return () => clearTimeout(timeoutId);
  }, [editor, data, editorContent, textColor, fontFamily, backgroundColor]);

  return {
    editor,
    color,
    setColor,
    initialTextColor: textColor,
    initialBackgroundColor: backgroundColor,
  };
}
