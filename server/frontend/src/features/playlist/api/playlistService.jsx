import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}playlist/`;
class PlaylistService {
  static async createPlaylist(playlistData) {
    const data = {
      name: playlistData,
    };
    const response = await fetchWithAuthorization(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la création de la playlist');
    }

    return await response.json();
  }

  static async getAllPlaylists() {
    const response = await fetchWithAuthorization(API_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des playlists');
    }

    return await response.json();
  }

  static async deletePlaylist(playlistId) {
    const response = await fetchWithAuthorization(`${API_URL}${playlistId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression de la playlist');
    }

    return await response.json();
  }

  static async getPlaylistById(playlistId) {
    const response = await fetchWithAuthorization(`${API_URL}${playlistId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération de la playlist');
    }

    return await response.json();
  }

  static async updateNamePlaylist(playlistId, name) {

    const response = await fetchWithAuthorization(`${API_URL}${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de la playlist');
    }

    return await response.json();
  }

  static async updateMediasInPlaylist(medias, playlistId) {
    const response = await fetchWithAuthorization(
      `${API_URL}${playlistId}/medias`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medias),
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la mise à jour des médias de la playlist');
    }

    return await response.json();
  }
}

export default PlaylistService;
