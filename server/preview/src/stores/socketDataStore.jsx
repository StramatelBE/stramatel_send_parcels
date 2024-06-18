import { create } from 'zustand';

const useSocketData = create((set) => ({
    socketData: null,
    setSocketData: (newData) => set({ socketData: newData }),
    clearSocketData: () => set({ socketData: null }),
}));

export default useSocketData;
