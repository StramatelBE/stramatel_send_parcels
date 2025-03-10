const API_URL = `${process.env.API_URL}data/`;

class DataService {
  static async getOneData(id) {
    const response = await fetch(`${API_URL}${id}`, {
      method: "GET",
    });

    return await response.json();
  }
}

export default DataService;
