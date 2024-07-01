import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: false, // état de chargement initial
  setLoading: (loadingState) => set({ isLoading: loadingState }),
}));

export default useLoadingStore;
