import axios from "axios";
import { storage } from "../utils/storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const client = axios.create({ baseURL: BASE_URL, timeout: 15000 });

// AuthContext registers a callback here so it can log the user out
// when a session can no longer be recovered.
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// Attach the access token to every request
client.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Trade the refresh token for a new access token.
// Uses plain axios so this call skips the interceptors below.
async function refreshAccessToken() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, null, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  storage.setAccessToken(data.access_token);
  return data.access_token;
}

// Several requests can fail at once; they all wait for one shared refresh
let refreshPromise = null;

// On 401: refresh the access token once, then retry the original request.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    // Wrong credentials on login also return 401 and must not trigger a refresh
    const isLoginCall = original?.url?.startsWith("/auth/login");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isLoginCall
    ) {
      original._retry = true;
      try {
        refreshPromise =
          refreshPromise ||
          refreshAccessToken().finally(() => (refreshPromise = null));
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch {
        // Refresh failed: the session is over
        storage.clear();
        onUnauthorized?.();
      }
    }
    return Promise.reject(error);
  },
);

export default client;
