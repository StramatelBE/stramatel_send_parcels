import { useCallback } from 'react';
import AccidentService from '../api/accidentService';
import accidentStore from '../stores/accidentStore';

function useAccident() {
  const { setAccidents, accidents } = accidentStore();

  const getAllAccidents = useCallback(async () => {
    const accidents = await AccidentService.getAllAccidents();
    setAccidents(accidents.data); 
    return accidents;
  }, [setAccidents]);

  const updateAccident = useCallback(
    async (newAccident) => {
      await AccidentService.updateAccident(newAccident);
      setAccidents(updatedAccidents);
    },
    [accidents, setAccidents]
  );

  return {
    getAllAccidents,
    updateAccident,
  };
}

export default useAccident;
