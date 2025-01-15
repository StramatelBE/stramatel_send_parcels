import DataComponent from "./components/DataComponent";
import EditorDataComponent from "./components/EditorDataComponent";
import InformationComponent from "./components/InformationComponent";
import PlaylistComponent from "./components/PlaylistComponent";
import TestComponent from "./components/TestComponent";
import useData from "./hooks/useData";
import useSocketData from "./stores/socketDataStore";
import useStandbyStore from "./stores/standbyStore";

function App() {
  useData();
  const { socketData } = useSocketData();
  const { isStandby } = useStandbyStore();

  return (
    <>
      {isStandby ? (
        <></>
      ) : (
        <>
          {socketData?.mode.name === "textEditor" && <EditorDataComponent />}
          {socketData?.mode.name === "test" && <TestComponent />}
          {socketData?.mode.name === "data" && <DataComponent />}
          {socketData?.mode.name === "playlist" && <PlaylistComponent />}
          {socketData?.mode.name === "information" && <InformationComponent />}
        </>
      )}
    </>
  );
}

export default App;
