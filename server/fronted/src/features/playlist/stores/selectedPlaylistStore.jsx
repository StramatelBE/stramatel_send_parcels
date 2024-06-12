import create from "zustand";

const selectedPlaylistStore = create((set) => ({
  selectedPlaylist: null,
  setSelectedPlaylist: (selectedPlaylist) => set({ selectedPlaylist }),
  clearSelectedPlaylist: () => set({ selectedPlaylist: null }),
}));

export default selectedPlaylistStore;
