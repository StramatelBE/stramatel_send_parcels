import { useCallback } from 'react';
import AccidentService from '../api/accidentService';
import accidentStore from '../stores/accidentStore';

function useAccident() {
  const { setAccidents, accidents } = accidentStore();

  const getAllAccidents = useCallback(async () => {
    const data = await AccidentService.getAllAccidents();
    setAccidents(data.accidents[0]);
    return data.accidents;
  }, [setAccidents]);

  const updateAccident = useCallback(
    async (newAccident) => {
      const updated = await AccidentService.updateAccident(newAccident);
      setAccidents(updated.accident);
    },
    [accidents, setAccidents]
  );

  return {
    getAllAccidents,
    updateAccident,
  };
}

export default useAccident;
