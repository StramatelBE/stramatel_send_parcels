import { create } from 'zustand';

const playlistStore = create((set) => ({
  playlists: [],
  addPlaylist: (playlist) =>
    set((state) => ({ playlists: [...state.playlists, playlist] })),
  removePlaylist: (id) =>
    set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),
  setPlaylists: (playlists) => {
    console.log("Setting playlists:", playlists);
    set({ playlists });
  },
  updatePlaylistName: (id, name) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === id ? { ...playlist, name } : playlist
      ),
    }));
  },
}));

export default playlistStore;
