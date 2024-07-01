import { create } from 'zustand';

const accidentStore = create((set) => ({
  accidents: [],
  setAccidents: (accidents) => {
    set({ accidents });
  },
  updateAccident: (updatedAccident) => {
    set((state) => ({
      accidents: state.accidents.map((accident) =>
        accident.id === updatedAccident.id ? updatedAccident : accident
      ),
    }));
  },
  resetAccidentsOnNewYear: () => {
    set({ accidents: [] });
  },
}));

export default accidentStore;
