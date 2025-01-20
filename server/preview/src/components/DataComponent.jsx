import useSocketData from "../stores/socketDataStore";

function DataComponent() {
  const { socketData } = useSocketData();
  return (
    <div>
      {socketData.data.length === 0 ? (
        <></>
      ) : (
        socketData.data.map((data) => (
          <div key={data.id}>
            {data.name} : {data.value}
          </div>
        ))
      )}
    </div>
  );
}

export default DataComponent;
