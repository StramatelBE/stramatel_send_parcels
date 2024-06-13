import { useCallback } from 'react';
import ModeService from '../api/modeService';
import modeStore from '../stores/modeStore';

function useModes() {
  const { setModes } = modeStore();

  const getMode = useCallback(async () => {
    const mode = await ModeService.getModeById(1);
    setModes(mode.data);
    return mode;
  }, [setModes]);

  const updateMode = useCallback(
    async (mode, playlist_id) => {
      const updatedMode = await ModeService.updateMode(mode, playlist_id);
      setModes(updatedMode.data);
      return updatedMode;
    },
    [setModes]
  );

  return {
    updateMode: updateMode,
    getMode: getMode,
  };
}

export default useModes;
