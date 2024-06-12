import useAuthStore from "../stores/authStore";

export async function fetchWithAuthorization(url, options) {
  const { token, clearToken } = useAuthStore.getState();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (response.status === 401) {
    console.log("La réponse a un statut de 401");
    clearToken();
    window.location.reload();
  }
  return response;
}
