import { useCallback, useEffect } from "react";
import PlaylistService from "../api/playlistService";
import playlistStore from "../stores/playlistsStores";
import selectedPlaylistStore from "../stores/selectedPlaylistStore";

const usePlaylists = () => {
  const { setPlaylists, removePlaylist, playlists } = playlistStore();
  const { setSelectedPlaylist } = selectedPlaylistStore();

  const getAllPlaylists = useCallback(async () => {
    try {
      const response = await PlaylistService.getAllPlaylists();
      setPlaylists(response.data);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  }, [setPlaylists]);

  const addPlaylist = useCallback(
    async (name) => {
      try {
        const newPlaylist = await PlaylistService.createPlaylist(name);
        setPlaylists([...playlists, newPlaylist.data]);
      } catch (error) {
        console.error("Failed to add playlist:", error);
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
        console.error("Failed to delete playlist:", error);
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
        console.error("Failed to fetch playlist by ID:", error);
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

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  return {
    addPlaylist,
    deletePlaylist,
    getPlaylistById,
    updateMediasInPlaylist,
  };
};

export default usePlaylists;
