import { fetchWithAuthorization } from "../../../utils/fetchWithAuthorization";

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}data/`;

class DataService {
  static async createData(data) {
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Échec de la création des données");
    }

    return await response.json();
  }

  static async getAllData() {
    const response = await fetchWithAuthorization(`${API_URL}`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error("Échec de la récupération des données");
    }

    return await response.json();
  }

  static async getDataById(dataId) {
    const response = await fetchWithAuthorization(`${API_URL}${dataId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Échec de la récupération des données");
    }

    return await response.json();
  }

  static async updateData(data) {
    const response = await fetchWithAuthorization(`${API_URL}${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Échec de la mise à jour des données");
    }

    return await response.json();
  }

  static async deleteData(dataId) {
    const response = await fetchWithAuthorization(`${API_URL}${dataId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Échec de la suppression des données");
    }

    return await response.json();
  }
}

export default DataService;