import { useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useSocketData from "../stores/socketDataStore";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import AutoDateExtension from "../extensions/AutoDateExtension";
import AutoTimeExtension from "../extensions/AutoTimeExtension";

function EditorDataComponent() {
  const { socketData } = useSocketData();

  const content = useMemo(() => {
    if (socketData?.data?.length > 0) {
      const parsed = JSON.parse(socketData.data[0].value);

      return parsed;
    }
    return ""; // Valeur par défaut si aucun contenu n'est disponible
  }, [socketData]);

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      AutoDateExtension,
      AutoTimeExtension,
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

export default EditorDataComponent;
