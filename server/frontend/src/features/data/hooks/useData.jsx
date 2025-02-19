import { useCallback } from 'react';
import DataService from '../api/dataService';
import dataStore from '../stores/dataStore';
import useLoadingStore from '../../../stores/loadingStore';
import MediaService from '../../playlist/api/mediaService';

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
      const response = await DataService.updateData(newData);
      const updatedData = data.map((item) =>
        item.id === newData.id ? { ...response.data } : item
      );
      setData(updatedData);
      setSelectedData(response.data);
      return response.data;
    },
    [data, setData, setSelectedData]
  );

  const updateBackgroundData = useCallback(async (file) => {
    if (!selectedData) return;

    try {
      const uploadFile = await MediaService.uploadFile(file);
      const response = await updateData({
        id: selectedData.id,
        background_id: uploadFile.file.id,
      });
      const updatedData = data.map((item) =>
        item.id === selectedData.id
          ? {
              ...item,
              ...response.data,
              background: { ...item.background, path: uploadFile.file.path },
            }
          : item
      );
      setData(updatedData);
      setSelectedData(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  }, []);

  const deleteBackgroundData = useCallback(async () => {
    if (!selectedData) return;
    console.log('selectedData', selectedData);
    await MediaService.deleteMedia(selectedData.background.id);
    await updateData({
      id: selectedData.id,
      background_id: null,
    });
    const updatedData = data.map((item) =>
      item.id === selectedData.id ? { ...item, background: null } : item
    );
    setData(updatedData);
    setSelectedData(updatedData);
  }, []);
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
    getAllData,
    getTemperature,
    updateData,
    updateBackgroundData,
    addData,
    deleteData,
    data,
    setSelectedData,
    selectedData,
    clearSelectedData,
    deleteBackgroundData,
  };
}

export default useData;
