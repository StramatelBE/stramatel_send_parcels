import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${process.env.API_URL}playlist-item/`;
class PlaylistItemService {
  static async createPlaylistItem(playlist_id, media_id) {
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlist_id: playlist_id, media_id: media_id }),
    });
    if (!response.ok) {
      throw new Error("Échec de l'ajout de la playlist");
    }
    return await response.json();
  }

  static async deletePlaylistItem(playlistItemId) {
    const response = await fetchWithAuthorization(
      `${API_URL}${playlistItemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la suppression de la playlist');
    }

    return await response.json();
  }

  static async updatePlaylistItem(playlistItemUpdate) {
    const isArray = Array.isArray(playlistItemUpdate);
    const url = isArray ? `${API_URL}` : `${API_URL}${playlistItemUpdate.id}`;

    const response = await fetchWithAuthorization(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistItemUpdate),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de la playlist');
    }

    return await response.json();
  }
}

export default PlaylistItemService;
