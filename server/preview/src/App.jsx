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
  console.log(socketData?.settings?.brightness);
  return (
    <>
      {isStandby ? (
        <></>
      ) : (
        <div
          style={{
            opacity: socketData?.settings?.brightness
              ? socketData.settings.brightness / 10
              : 1,
          }}
        >
          {socketData?.mode.name === "textEditor" && <EditorDataComponent />}
          {socketData?.mode.name === "test" && <TestComponent />}
          {socketData?.mode.name === "data" && <DataComponent />}
          {socketData?.mode.name === "playlist" && <PlaylistComponent />}
          {socketData?.mode.name === "information" && <InformationComponent />}
        </div>
      )}
    </>
  );
}

export default App;
