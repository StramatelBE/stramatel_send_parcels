import { EditorContent } from "@tiptap/react";
import PropTypes from 'prop-types';
import useEditor from "../hooks/useEditor";

function Editor({ data }) {
  const {editor} = useEditor({ data: data });
  return (
    <div
      className="tiptap-text-container"
      style={{
        maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
        maxWidth: `${process.env.PREVIEW_WIDTH}px`,
        minWidth: `${process.env.PREVIEW_WIDTH}px`,
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

