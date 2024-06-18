import React, { useEffect } from "react";
import useSocketData from "./stores/socketDataStore";
import useData from "./hooks/useData";
import TestComponents from "./components/TestComponents";
import DataComposant  from "./components/DataComposant"
import PlaylistComposant from "./components/PlaylistComposant";
function App() {
  useData();

  const {socketData} = useSocketData();
/*   useEffect(() => {
    console.log(socketData)
  }, [socketData]) */
 
  return <>
    {socketData?.mode === "test" && <TestComponents />}
    {socketData?.mode === "data" && <DataComposant />}
    {socketData?.mode === "playlist" && <PlaylistComposant />}
  </>;
}

export default App;
