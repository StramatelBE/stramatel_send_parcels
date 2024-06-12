import { useCallback, useEffect } from "react";
import ModeService from "../api/modeService";
import modeStore from "../stores/modeStore";

function useModes() {
  const { setModes } = modeStore();

  const getModeById = useCallback(async () => {
    const mode = await ModeService.getModeById(1);
    setModes(mode.data);
    return mode;
  }, [setModes]);

  useEffect(() => {
    getModeById();
  }, [getModeById]);

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
  };
}

export default useModes;
