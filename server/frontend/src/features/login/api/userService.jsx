class UserService {
  static async login(username, password) {

  const response = await fetch(`${process.env.API_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (!response.ok) {
    throw new Error('Échec de la connexion');
  }

  const data = await response.json();
  return data;
  }
}

export default UserService;
