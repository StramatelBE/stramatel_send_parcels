import create from 'zustand';

const dataStore = create((set) => ({
  data: [],
  setData: (data) => {
    set({ data });
  },
}));

export default dataStore;
