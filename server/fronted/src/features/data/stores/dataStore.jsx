import create from "zustand";

const dataStore = create((set) => ({
  data: [],
  setData: (data) => {
    console.log("Setting data:", data);
    set({ data  });
  },
}));

export default dataStore;
