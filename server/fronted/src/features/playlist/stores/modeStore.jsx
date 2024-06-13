import { create } from 'zustand';

const modeStore = create((set) => ({
  modes: [],
  setModes: (modes) => set({ modes }),
}));

export default modeStore;
