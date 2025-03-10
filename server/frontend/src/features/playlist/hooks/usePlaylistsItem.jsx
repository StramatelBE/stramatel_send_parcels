import { useCallback } from 'react';
import MediaService from '../api/mediaService';
import PlaylistItemService from '../api/playlistItemService';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';

const usePlaylistsItem = () => {
  const { setSelectedPlaylist, selectedPlaylist } = selectedPlaylistStore();

  const updatePlaylistItems = useCallback(
    async (items) => {
      try {
        setSelectedPlaylist({
          ...selectedPlaylist,
          PlaylistItem: items,
        });
        const response = await PlaylistItemService.updatePlaylistItem(items);
        setSelectedPlaylist({
          ...selectedPlaylist,
          PlaylistItem: response.data,
        });
      } catch (error) {
        console.error('Failed to update playlist items:', error);
      }
    },
    [setSelectedPlaylist, selectedPlaylist]
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

  const createPlaylistItemEditor = useCallback(
    async (playlistId) => {
      try {
        const response = await PlaylistItemService.createPlaylistItem(
          playlistId
        );

        setSelectedPlaylist({
          ...selectedPlaylist,
          PlaylistItem: [...selectedPlaylist.PlaylistItem, response.data],
        });
      } catch (error) {
        console.error('Failed to add playlist item:', error);
      }
    },
    [selectedPlaylist, setSelectedPlaylist]
  );

  const updatePlaylistItem = useCallback(
    async (PlaylistItemUpdate) => {
      try {
        const response = await PlaylistItemService.updatePlaylistItem(
          PlaylistItemUpdate
        );

        setSelectedPlaylist({
          ...selectedPlaylist,
          PlaylistItem: selectedPlaylist.PlaylistItem.map((item) =>
            item.id === response.data.id ? response.data : item
          ),
        });
      } catch (error) {
        console.error('Failed to update playlist item:', error);
      }
    },
    [selectedPlaylist, setSelectedPlaylist]
  );

  const createPlaylistItemMedias = useCallback(
    async (file) => {
      try {
        const response = await MediaService.uploadFile(file);
        const playlistItem = await PlaylistItemService.createPlaylistItem(
          selectedPlaylist.id,
          response.file.id
        );

        setSelectedPlaylist({
          ...selectedPlaylist,
          PlaylistItem: [...selectedPlaylist.PlaylistItem, playlistItem.data],
        });
        return playlistItem;
      } catch (error) {
        console.error('Failed to upload media:', error);
      }
    },
    [selectedPlaylist, setSelectedPlaylist]
  );

  return {
    createPlaylistItemMedias,
    createPlaylistItemEditor,
    updatePlaylistItem,
    updatePlaylistItems,
    deletePlaylistItem,
  };
};

export default usePlaylistsItem;
