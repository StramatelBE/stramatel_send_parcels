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
      
      const dataUpdate = { ...selectedData, value: newData };
      const response = await DataService.updateData(dataUpdate);
      const updatedData = data.map((item) =>
        item.id === dataUpdate.id ? { ...response.data } : item
      );
      

      setData(updatedData);
 
      
    },
    []
  );


  const addData = useCallback(
    async (name) => {
      const data = {
        type: 'doc',
        content: [
          {
            background: {
              color: '#000000',
            },
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
