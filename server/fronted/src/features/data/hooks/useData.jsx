import { useCallback } from 'react';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';

function useData() {
  const { setData, data } = dataStore();

  const getAllData = useCallback(async () => {
    console.log('getDatas');
    const data = await DataService.getAllData();
    setData(data.data);
    return data;
  }, [setData]);

  const updateData = useCallback(
    async (newData) => {
      await DataService.updateData(newData);
      const updatedData = data.map((item) =>
        item.id === newData.id ? { ...item, ...newData } : item
      );
      setData(updatedData);
    },
    [data, setData]
  );

  return {
    getAllData: getAllData,
    updateData: updateData,
  };
}

export default useData;
