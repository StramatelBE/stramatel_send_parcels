import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useSocketData from "../stores/socketDataStore";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import AutoDateExtension from "../extensions/AutoDateExtension";
import AutoTimeExtension from "../extensions/AutoTimeExtension";
import TextSizeExtension from "../extensions/TextSizeExtension";
import TextStyle from "@tiptap/extension-text-style";
import PropTypes from "prop-types";
import TextColorExtension from "../extensions/TextColorExtension";
import BackgroundExtension from "../extensions/BackgroundExtension";
import AutoTemperatureExtension from "../extensions/AutoTemperatureExtension";

function EditorDataComponent({ currentMedia }) {
  const { socketData } = useSocketData();

  const content = useMemo(() => {
    if (socketData?.data?.length > 0 && currentMedia?.path) {
      const matchedData = socketData.data.find(
        (item) => item.id === parseInt(currentMedia.path)
      );

      if (matchedData) {
        const parsed = JSON.parse(matchedData.value);
        return parsed;
      }
    }
    return ""; // Valeur par défaut si aucun contenu n'est disponible
  }, [socketData, currentMedia]);
  const [editorBackgroundColor, setEditorBackgroundColor] = useState(
    content?.attrs?.backgroundColor || "#ffffff"
  );
  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      AutoDateExtension,
      AutoTimeExtension,
      TextSizeExtension.configure({
        defaultSize: "32px",
      }),
      TextColorExtension.configure({
        defaultColor: "#ffffff",
      }),
      BackgroundExtension.configure({
        defaultBackgroundColor: "#ffffff",
      }),
      AutoTemperatureExtension,
    ],
  });

  const previousContent = useRef(content);
  useEffect(() => {
    if (editor) {
      editor.commands.setBackground(editorBackgroundColor);
    }
  }, [editor, editorBackgroundColor]);



  return (
    <div
      className="tiptap-text-container"
      style={{
        maxHeight: `${process.env.PREVIEW_HEIGHT}px`,
        maxWidth: `${process.env.PREVIEW_WIDTH}px`,
        minWidth: `${process.env.PREVIEW_WIDTH}px`,
        overflow: "hidden",
        scrollbarWidth: "none",
        margin: "0 auto",
      }}
    >
      <EditorContent
        className="fixed-editor max-width-editor"
        editor={editor}
      />
    </div>
  );
}

EditorDataComponent.propTypes = {
  currentMedia: PropTypes.object.isRequired, // Adjust the type as needed
};

export default EditorDataComponent;
