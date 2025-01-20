import dataStore from '../stores/dataStore';
import DataListComponents from './DataListComponents';
import EditorComponents from './EditorComponents';

function DataComponents() {
  const { selectedData } = dataStore();

  return (
    <div>
      {selectedData?.id ? <EditorComponents /> : <DataListComponents />}
    </div>
  );
}

export default DataComponents;
