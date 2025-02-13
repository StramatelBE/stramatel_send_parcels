import { useCallback } from 'react';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';
import useLoadingStore from '../../../stores/loadingStore';

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

  const uploadBackground = useCallback(
    async (file) => {
      if (!selectedData) return;

      try {
        const response = await DataService.uploadBackground(
          selectedData.id,
          file
        );
        const updatedData = data.map((item) =>
          item.id === selectedData.id ? { ...item, ...response.data } : item
        );
        setData(updatedData);
        setSelectedData(response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        throw error;
      }
    },
    [data, selectedData, setData, setSelectedData]
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

  const deleteBackground = useCallback(async () => {
    await DataService.deleteBackground(selectedData);
    setSelectedData({ ...selectedData, background: null });
  }, [selectedData, setSelectedData]);

  const clearSelectedData = useCallback(() => {
    setSelectedData(null);
  }, [setSelectedData]);

  return {
    getAllData: getAllData,
    getTemperature: getTemperature,
    updateData: updateData,
    uploadBackground: uploadBackground,
    addData: addData,
    deleteData: deleteData,
    deleteBackground: deleteBackground,
    data: data,
    setSelectedData: setSelectedData,
    selectedData: selectedData,
    clearSelectedData: clearSelectedData,
  };
}

export default useData;
