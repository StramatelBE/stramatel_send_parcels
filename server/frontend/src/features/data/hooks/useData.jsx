import { useCallback } from 'react';
import useLoadingStore from '../../../stores/loadingStore';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';

function useData() {
  const { setData, data, setSelectedData, selectedData } = dataStore();
  const { setLoading } = useLoadingStore();

  const getAllData = useCallback(async () => {
    setLoading(true);
    const response = await DataService.getAllData();
    const filteredData = response.data.filter((item) => item.type === 'EDIT');
    setData(filteredData);
    setLoading(false);
    return response;
  }, [setData, setLoading]);
  const getTemperature = async () => {
    const response = await DataService.getOneData(1);
    return response.data.value;
  };

  const updateData = useCallback(async (newData) => {
    console.log(newData);

    const response = await DataService.updateData(newData);
    const updatedData = data.map((item) =>
      item.id === newData.id ? { ...response.data } : item
    );

    setSelectedData(response.data);
    setData(updatedData);
  }, []);

  const addData = useCallback(
    async (name) => {
      const data = {
        type: 'doc',
        backgroundColor: '#000000',
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
    getAllData,
    getTemperature,
    updateData,
    addData,
    deleteData,
    data,
    setSelectedData,
    selectedData,
    clearSelectedData,
  };
}

export default useData;
