import { create } from 'zustand';
const dataStore = create((set) => ({
  data: [],
  selectedData: null,
  setData: (data) => {
    set({ data });
  },
  setSelectedData: (data) => {
    console.log('data', data);
    set({ selectedData: data });
  },
}));

export default dataStore;
