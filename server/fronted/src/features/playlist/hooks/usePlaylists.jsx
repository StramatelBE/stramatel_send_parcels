import { useCallback } from 'react';
import PlaylistService from '../api/playlistService';
import playlistStore from '../stores/playlistsStores';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';

const usePlaylists = () => {
  const { setPlaylists, removePlaylist, playlists, updatePlaylistName } = playlistStore();
  const { setSelectedPlaylist,  } = selectedPlaylistStore();

  const getAllPlaylists = useCallback(async () => {
    try {
      const response = await PlaylistService.getAllPlaylists();
      setPlaylists(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    }
  }, [setPlaylists]);

  const addPlaylist = useCallback(
    async (name) => {
      try {
        const newPlaylist = await PlaylistService.createPlaylist(name);
        setPlaylists([...playlists, newPlaylist.data]);
      } catch (error) {
        console.error('Failed to add playlist:', error);
      }
    },
    [playlists, setPlaylists]
  );

  const deletePlaylist = useCallback(
    async (id) => {
      try {
        await PlaylistService.deletePlaylist(id);
        removePlaylist(id);
      } catch (error) {
        console.error('Failed to delete playlist:', error);
      }
    },
    [removePlaylist]
  );

  const getPlaylistById = useCallback(
    async (id) => {
      try {
        const response = await PlaylistService.getPlaylistById(id);
        setSelectedPlaylist(response.data);
      } catch (error) {
        console.error('Failed to fetch playlist by ID:', error);
      }
    },
    [setSelectedPlaylist]
  );
  const updateMediasInPlaylist = useCallback(
    async (items, selectedPlaylist) => {
      setSelectedPlaylist({
        ...selectedPlaylist,
        medias: items,
      });
      await PlaylistService.updateMediasInPlaylist(items, selectedPlaylist.id);
    },
    [setSelectedPlaylist]
  );

  const updateNamePlaylist = useCallback(
    async (selectedPlaylist, name) => {
      try {
        await PlaylistService.updateNamePlaylist(selectedPlaylist.id, name);
        setSelectedPlaylist({
          ...selectedPlaylist,
          name: name,
        });
        updatePlaylistName(selectedPlaylist.id, name);
      } catch (error) {
        console.error('Failed to update playlist name:', error);
      }
    },
    [setSelectedPlaylist, updatePlaylistName]
  );

  return {
    addPlaylist,
    getAllPlaylists: getAllPlaylists,
    deletePlaylist,
    getPlaylistById,
    updateMediasInPlaylist,
    updateNamePlaylist
  };
};

export default usePlaylists;
