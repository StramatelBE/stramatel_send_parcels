import { useCallback } from 'react';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';
import useLoadingStore from '../../../stores/loadingStore';

function useData() {
  const { setData, data } = dataStore();
  const { setLoading } = useLoadingStore();

  const getAllData = useCallback(async () => {
    setLoading(true);
    const data = await DataService.getAllData();
    setData(data.data);
    setLoading(false);
    return data;
  }, [setData, setLoading]);

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
