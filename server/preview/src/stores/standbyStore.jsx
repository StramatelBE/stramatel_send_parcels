import { create } from "zustand";

const useStandbyStore = create((set) => ({
  standby: false,
  standbyStartTime: null,
  standbyEndTime: null,
  isStandby: false,
  setStandby: (standby) => set({ standby }),
  setStandbyTimes: (startTime, endTime) =>
    set({ standbyStartTime: startTime, standbyEndTime: endTime }),
  setIsStandby: (isStandby) => set({ isStandby }),
  clearStandby: () =>
    set({
      standby: false,
      standbyStartTime: null,
      standbyEndTime: null,
      isStandby: false,
    }),
}));

export default useStandbyStore;
