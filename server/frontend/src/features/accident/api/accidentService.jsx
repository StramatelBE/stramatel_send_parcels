import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}accidents/`;

class AccidentService {
  static async getAllAccidents() {
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération des accidents');
    }

    return await response.json();
  }

  static async updateAccident(accident) {
    const response = await fetchWithAuthorization(`${API_URL}${accident.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accident),
    });

    if (!response.ok) {
      throw new Error("Échec de la mise à jour de l'accident");
    }

    return await response.json();
  }
}

export default AccidentService;
