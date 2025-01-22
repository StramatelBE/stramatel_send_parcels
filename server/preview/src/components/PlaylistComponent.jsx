import { useEffect, useRef, useState } from "react";
import useSocketData from "../stores/socketDataStore";
import InformationComponent from "./InformationComponent";
import EditorDataComponent from "./EditorDataComponent";

function PlaylistComponent() {
  const { socketData } = useSocketData();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const intervalRef = useRef(null);

  // Trier les médias en fonction de leur position
  const sortedMedias = socketData.playlist.medias.sort(
    (a, b) => a.position - b.position
  );

  useEffect(() => {
    if (sortedMedias.length === 0) return;

    const currentMedia = sortedMedias[currentMediaIndex];
    if (!currentMedia) return;

    const duration = currentMedia.duration * 1000;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentMediaIndex(
        (prevIndex) => (prevIndex + 1) % sortedMedias.length
      );
    }, duration);

    return () => clearInterval(intervalRef.current);
  }, [currentMediaIndex, sortedMedias.length]);

  const currentMedia = sortedMedias[currentMediaIndex];
  if (!currentMedia) return null;

  const mediaPath = `${process.env.FRONT_URL}${currentMedia?.path}`;

  return (
    <div
      style={{
        height: `${process.env.PREVIEW_HEIGHT}px`,
        width: `${process.env.PREVIEW_WIDTH}px`,
      }}
    >
      {currentMedia?.type === "video" ? (
        <video
          className="medias"
          src={mediaPath}
          onError={() =>
            setCurrentMediaIndex(
              (prevIndex) => (prevIndex + 1) % sortedMedias.length
            )
          }
          autoPlay
          muted
          loop
          preload="auto"
        />
      ) : currentMedia?.type === "image" ? (
        <img
          className="medias"
          src={mediaPath}
          onError={() =>
            setCurrentMediaIndex(
              (prevIndex) => (prevIndex + 1) % sortedMedias.length
            )
          }
          alt={currentMedia?.original_file_name}
        />
      ) : currentMedia?.type === "information" ? (
        <InformationComponent />
      ) : currentMedia?.type === "textEditor" ? (
        <EditorDataComponent currentMedia={currentMedia} />
      ) : null}
    </div>
  );
}

export default PlaylistComponent;
