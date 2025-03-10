import { EditorContent } from "@tiptap/react";
import PropTypes from 'prop-types';
import useEditor from "../hooks/useEditor";
import { EDITOR_RATIO } from "../constants/editorConstants";
import { useEffect } from "react";

function Editor({ data }) {
  const { editor } = useEditor({ data: data });
  
  // Ajouter un style global pour appliquer la taille de texte à l'ensemble de l'éditeur
  useEffect(() => {
    if (editor) {
      // Récupérer l'élément racine de l'éditeur
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        // Taille de base pour le texte (sera multipliée par le ratio)
        const BASE_TEXT_SIZE = 24;
        const scaledSize = Math.round(BASE_TEXT_SIZE * EDITOR_RATIO);
        
        // Appliquer le style globalement à l'éditeur
        editorElement.style.fontSize = `${scaledSize}px`;
        console.log(`Applied base font size: ${scaledSize}px to editor`);
      }
    }
  }, [editor]);
  
  return (
    <div
      className="tiptap-text-container"
      style={{
        // Pas de fontSize ici car il est appliqué directement à l'éditeur
        maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
        maxWidth: `${process.env.PREVIEW_WIDTH }px`,
        minWidth: `${process.env.PREVIEW_WIDTH }px`,
        minHeight: `${process.env.PREVIEW_HEIGHT }px`,
        overflow: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <EditorContent className="fixed-editor" editor={editor} />
    </div>
  );
}

Editor.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string
  }).isRequired
};

export default Editor;

