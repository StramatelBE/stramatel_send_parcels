import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${process.env.API_URL}data/`;

class DataService {
  static async getAllData() {
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des données');
    }

    return await response.json();
  }
  static async getOneData(id) {
    const response = await fetchWithAuthorization(`${API_URL}${id}`, {
      method: 'GET',
    });

    return await response.json();
  }
  static async updateData(data) {
    const response = await fetchWithAuthorization(`${API_URL}${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Échec de la mise à jour des données');
    }

    return await response.json();
  }

  static async addData(name, value, type) {
    await fetchWithAuthorization(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, value, type }),
    });
  }
  static async deleteData(id) {
    await fetchWithAuthorization(`${API_URL}${id}`, {
      method: 'DELETE',
    });
  }
}

export default DataService;
