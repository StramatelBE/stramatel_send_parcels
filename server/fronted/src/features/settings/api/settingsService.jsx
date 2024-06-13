import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

class SettingsService {
  static async getSettings() {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/`,
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

  static async createSetting(settingData) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/`,
      {
        method: 'POST',
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

  static async getSettingById(settingId) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/${settingId}`,
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

  static async updateSetting(settingId, settingData) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/${settingId}`,
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

  static async deleteSetting(settingId) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/${settingId}`,
      {
        method: 'DELETE',
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
