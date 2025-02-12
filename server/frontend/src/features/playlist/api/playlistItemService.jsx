import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${process.env.API_URL}playlist-item/`;
class PlaylistItemService {
  static async addPlaylistItem(playlist_id) {
    console.log(typeof playlist_id);
    await fetchWithAuthorization(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playlist_id }),
    });
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
    console.log(playlistItemUpdate);

    const response = await fetchWithAuthorization(
      `${API_URL}${playlistItemUpdate.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistItemUpdate),
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la mise à jour de la playlist');
    }

    return await response.json();
  }
}

export default PlaylistItemService;
