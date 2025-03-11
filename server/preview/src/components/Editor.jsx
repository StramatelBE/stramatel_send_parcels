import { EditorContent } from "@tiptap/react";
import PropTypes from "prop-types";
import useEditor from "../hooks/useEditor";
import { EDITOR_RATIO } from "../constants/editorConstants";
import { useEffect } from "react";

function Editor({ data }) {
  const { editor } = useEditor({ data: data });

  // Ajouter un style global pour appliquer la taille de texte à l'ensemble de l'éditeur

  return (
    <div
      className="tiptap-text-container"
      style={{
        maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
        maxWidth: `${process.env.PREVIEW_WIDTH}px`,
        minWidth: `${process.env.PREVIEW_WIDTH}px`,
        minHeight: `${process.env.PREVIEW_HEIGHT}px`,
        overflow: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

Editor.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string,
  }).isRequired,
};

export default Editor;
