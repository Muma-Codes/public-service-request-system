// Thin wrapper around localStorage so token handling lives in one place.
const ACCESS_KEY = "psrs_access_token";
const REFRESH_KEY = "psrs_refresh_token";

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_KEY, token),
  setTokens: ({ accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
