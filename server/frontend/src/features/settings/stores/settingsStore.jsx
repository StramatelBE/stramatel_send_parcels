import { create } from 'zustand';

const settingsStore = create((set) => ({
  settings: [],
  setSettings: (settings) => set({ settings }),
}));

export default settingsStore;
