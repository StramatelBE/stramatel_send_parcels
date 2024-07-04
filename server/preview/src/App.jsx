import React from "react";
import useSocketData from "./stores/socketDataStore";
import useData from "./hooks/useData";
import useStandbyStore from "./stores/standbyStore";
import TestComponents from "./components/TestComponents";
import DataComposant from "./components/DataComposant";
import PlaylistComposant from "./components/PlaylistComposant";
import AccidentComposant from "./components/AccidentComposant";
import InformationComposant from "./components/InformationComposant";

function App() {
  useData();
  const { socketData } = useSocketData();
  const { isStandby } = useStandbyStore();

  return (
    <>
      
      {!isStandby ? (
        <></>
      ) : (
        <>
          {socketData?.mode.name === "test" && <TestComponents />}
          {socketData?.mode.name === "data" && <DataComposant />}
          {socketData?.mode.name === "playlist" && <PlaylistComposant />}
          {socketData?.mode.name === "accident" && <AccidentComposant />}
          {socketData?.mode.name === "information" && <InformationComposant />}
        </>
      )}
    </>
  );
}

export default App;
