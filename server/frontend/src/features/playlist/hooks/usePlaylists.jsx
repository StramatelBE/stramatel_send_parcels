import { useCallback } from 'react';
import PlaylistService from '../api/playlistService';
import playlistStore from '../stores/playlistsStores';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';
import useModes from './useMode';
import PlaylistItemService from '../api/playlistItemService';

const usePlaylists = () => {
  const { setPlaylists, removePlaylist, playlists, updatePlaylistName } =
    playlistStore();
  const { setSelectedPlaylist, selectedPlaylist } = selectedPlaylistStore();
  const { updateMode } = useModes();

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
        updateMode('null', null);
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
  const deletePlaylistItem = useCallback(
    async (id, selectedPlaylist) => {
      await PlaylistItemService.deletePlaylistItem(id);
      setSelectedPlaylist({
        ...selectedPlaylist,
        PlaylistItem: selectedPlaylist.PlaylistItem.filter(
          (item) => item.id !== id
        ),
      });
    },
    [setSelectedPlaylist]
  );

  const addPlaylistItemEditor = useCallback(
    async (playlistId) => {
      await PlaylistItemService.addPlaylistItem(playlistId);

      setSelectedPlaylist({
        ...selectedPlaylist,
        PlaylistItem: [...selectedPlaylist.PlaylistItem, { id: playlistId }],
      });
    },
    [selectedPlaylist, setSelectedPlaylist]
  );

  const updatePlaylistItem = useCallback(async (PlaylistItemUpdate) => {
    const updatedPlaylistItem = await PlaylistItemService.updatePlaylistItem(
      PlaylistItemUpdate
    );
    console.log('updatedPlaylistItem', updatedPlaylistItem.data);

    setSelectedPlaylist({
      ...selectedPlaylist,
      PlaylistItem: selectedPlaylist.PlaylistItem.map((item) =>
        item.id === updatedPlaylistItem.data.id
          ? updatedPlaylistItem.data
          : item
      ),
    });
  }, []);

  return {
    addPlaylist,
    getAllPlaylists,
    deletePlaylist,
    getPlaylistById,
    updateMediasInPlaylist,
    updateNamePlaylist,
    deletePlaylistItem,
    addPlaylistItemEditor,
    updatePlaylistItem,
  };
};

export default usePlaylists;
