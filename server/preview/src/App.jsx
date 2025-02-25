import { useEffect, useState } from "react";
import useSocketData from "./stores/socketDataStore";
import useData from "./hooks/useData";
import Medias from "./components/newComponent/Medias";
function App() {
  const [showPlaylist, setShowPlaylist] = useState(true);
  const { socketData } = useSocketData();

  useData();

  useEffect(() => {
    console.log("Données actuelles du socket:", socketData?.items?.[0]);
  }, [socketData]);

  return (
    <>
      {socketData?.items?.[0]?.modeName === "playlist" ? (
        socketData?.items?.[0]?.currentItem?.contentType === "media" ? (
          <Medias media={socketData?.items?.[0]?.currentItem?.media} />
        ) : (
          socketData?.items?.[0]?.currentItem?.contentType === "data" && (
            <div>data</div>
          )
        )
      ) : (
        <div>test</div>
      )}
    </>
  );
}

export default App;
