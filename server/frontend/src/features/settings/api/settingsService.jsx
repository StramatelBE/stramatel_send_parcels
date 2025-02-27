import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

const API_URL = process.env.API_URL + 'app-settings/';
class SettingsService {
  static async getSettings() {
    const response = await fetchWithAuthorization(
      `${API_URL}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  }

  static async updateDate(date) {
    const response = await fetchWithAuthorization(
      `${API_URL}date`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(date),
      }
    );
  }

  static async updateSetting(settingId, settingData) {
    const response = await fetchWithAuthorization(
      `${API_URL}${settingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  }
}

export default SettingsService;
