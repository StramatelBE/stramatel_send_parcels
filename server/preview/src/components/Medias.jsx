import { useEffect } from "react";

function Medias(data) {
  const mediaPath = `${process.env.FRONT_URL}${data?.media?.path}`;

  /*   useEffect(() => {
    console.log("medias", data?.media);
  }, [data]); */
  return (
    <div
      style={{
        height: `${process.env.PREVIEW_HEIGHT}px`,
        width: `${process.env.PREVIEW_WIDTH}px`,
      }}
    >
      {data?.media?.type === "video" ? (
        <video
          className="medias"
          src={mediaPath}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
      ) : data?.media?.type === "image" ? (
        <img
          className="medias"
          src={mediaPath}
          alt={data?.media?.original_file_name}
        />
      ) : null}
    </div>
  );
}

export default Medias;
