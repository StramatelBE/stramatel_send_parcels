import { useEffect } from "react";
import Editor from "./components/Editor";
import Medias from "./components/Medias";
import useData from "./hooks/useData";
import useSocketData from "./stores/socketDataStore";
import TestComponent from "./components/TestComponent";
function App() {
  const { socketData } = useSocketData();

  useData();

  /*   useEffect(() => {
    console.log("Données actuelles du socket:", socketData);
  }, [socketData]); */

  return (
    <>
      {socketData?.mode === "media" && (
        <Medias media={socketData.PlaylistItem.media} />
      )}
      {socketData?.mode === "data" && (
        <Editor data={socketData.PlaylistItem.data} />
      )}
      {socketData?.mode === "test" && <TestComponent />}
    </>
  );
}

export default App;
