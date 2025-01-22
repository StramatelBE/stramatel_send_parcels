import { useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useSocketData from "../stores/socketDataStore";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import AutoDateExtension from "../extensions/AutoDateExtension";
import AutoTimeExtension from "../extensions/AutoTimeExtension";
import TextSizeExtension from "../extensions/TextSizeExtension";
import TextStyle from "@tiptap/extension-text-style";
import PropTypes from 'prop-types';

function EditorDataComponent({ currentMedia }) {
  const { socketData } = useSocketData();

  const content = useMemo(() => {
    if (socketData?.data?.length > 0 && currentMedia?.path) {
      console.log(parseInt(currentMedia.path));
      

      // Trouver l'élément dans socketData qui correspond au path de currentMedia
      const matchedData = socketData.data.find(item => item.id === parseInt(currentMedia.path));

      if (matchedData) {
        console.log('matchedData', matchedData);
        const parsed = JSON.parse(matchedData.value);
        return parsed;
      }
    }
    return ""; // Valeur par défaut si aucun contenu n'est disponible
  }, [socketData, currentMedia]);

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
      
      TextSizeExtension,
    ],
  });

  const previousContent = useRef(content);

  useEffect(() => {
    if (editor && content && previousContent.current !== content) {
      editor.commands.setContent(content);
      previousContent.current = content;
    }
  }, [content, editor]);

  useEffect(() => {
    const interval = setInterval(() => {}, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
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
