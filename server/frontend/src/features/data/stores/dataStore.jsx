import { create } from 'zustand';
const dataStore = create((set) => ({
  data: [],
  selectedData: null,
  setData: (data) => {
    set({ data });
  },
  setSelectedData: (data) => {
    set({ selectedData: data });
  },
}));

export default dataStore;
