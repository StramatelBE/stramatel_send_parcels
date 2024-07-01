import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${process.env.API_URL}medias/`;

class MediaService {
  static async uploadFile(fileData, playlistId) {
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('playlistId', playlistId);
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Échec de l'upload du fichier");
    }

    return await response.json();
  }

  static async deleteMedia(mediaId) {
    const response = await fetchWithAuthorization(`${API_URL}${mediaId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression du média');
    }

    return await response.json();
  }

  static async updateMedia(media) {
    const response = await fetchWithAuthorization(`${API_URL}${media.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(media),
    });

    if (!response.ok) {
      throw new Error('Échec de la suppression du média');
    }

    return await response.json();
  }

  static async addData(type, playlistId) {
    const response = await fetchWithAuthorization(`${API_URL}/addData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, playlistId }),
    });
  }
}

export default MediaService;
