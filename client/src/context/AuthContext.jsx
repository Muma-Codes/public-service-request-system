import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../api/auth.api";
import { setUnauthorizedHandler } from "../api/client";
import { storage } from "../utils/storage";

export const AuthContext = createContext(null);

/** Holds the current citizen and the login / signup / logout actions. */
export function AuthProvider({ children }) {
  const [citizen, setCitizen] = useState(null);
  // Only "loading" if there is a saved session to restore, so visitors never see a loader
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(storage.getAccessToken() || storage.getRefreshToken()),
  );

  // Restore the session on page load
  useEffect(() => {
    if (!isLoading) return undefined;
    let cancelled = false;

    authApi
      .getCurrentCitizen()
      .then((me) => !cancelled && setCitizen(me))
      .catch((error) => {
        // 401 is cleaned up by the API client; 422 means a malformed token.
        // Network errors keep the tokens so a refresh later can still work.
        if (error.response?.status === 422) storage.clear();
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If a token refresh fails anywhere in the app, drop the user back to logged-out
  useEffect(() => {
    setUnauthorizedHandler(() => setCitizen(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    storage.setTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    setCitizen(data.citizen);
  }, []);

  // The register endpoint returns no tokens, so log in straight after creating the account
  const signup = useCallback(
    async ({ name, phone_number, password }) => {
      await authApi.register({ name, phone_number, password });
      await login({ phone_number, password });
    },
    [login],
  );

  const logout = useCallback(() => {
    storage.clear();
    setCitizen(null);
  }, []);

  const value = useMemo(
    () => ({
      citizen,
      isAuthenticated: Boolean(citizen),
      isLoading,
      login,
      signup,
      logout,
    }),
    [citizen, isLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
