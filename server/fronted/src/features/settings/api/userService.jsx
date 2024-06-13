import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

class UserService {
  static async changePassword(oldPassword, newPassword) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}auth/change-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  }
}

export default UserService;
