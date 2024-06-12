import create from "zustand";

const playlistStore = create((set) => ({
  playlists: [],
  addPlaylist: (playlist) =>
    set((state) => ({ playlists: [...state.playlists, playlist] })),
  removePlaylist: (id) =>
    set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),
  setPlaylists: (playlists) => set({ playlists }),
}));

export default playlistStore;
