import { useCallback } from 'react';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';
import useLoadingStore from '../../../stores/loadingStore';

function useData() {
  const { setData, data, setSelectedData, selectedData } = dataStore();
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
      setSelectedData(newData);
    },
    [data, setData, setSelectedData]
  );

  const addData = useCallback(
    async (name) => {
      const data = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              textAlign: 'center',
            },
            content: [],
          },
        ],
      };
      await DataService.addData(name, JSON.stringify(data), 'EDIT');
      await getAllData();
    },
    [getAllData]
  );

  const deleteData = useCallback(
    async (id) => {
      await DataService.deleteData(id);
      await getAllData();
    },
    [getAllData]
  );

  const clearSelectedData = useCallback(() => {
    setSelectedData(null);
  }, [setSelectedData]);

  return {
    getAllData: getAllData,
    updateData: updateData,
    addData: addData,
    deleteData: deleteData,
    data: data,
    setSelectedData: setSelectedData,
    selectedData: selectedData,
    clearSelectedData: clearSelectedData,
  };
}

export default useData;
