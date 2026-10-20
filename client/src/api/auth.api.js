import client from "./client";

/** POST /auth/login -> { access_token, refresh_token, citizen } */
export const login = ({ phone_number, password }) =>
  client
    .post("/auth/login", { phone_number, password })
    .then((res) => res.data);

/**
 * POST /citizens -> the new citizen.
 * The backend reads request.form, so this must be form-encoded, not JSON.
 * (axios sends URLSearchParams as application/x-www-form-urlencoded.)
 */
export const register = ({ name, phone_number, password }) =>
  client
    .post("/citizens", new URLSearchParams({ name, phone_number, password }))
    .then((res) => res.data);

/** GET /auth/me -> the logged-in citizen */
export const getCurrentCitizen = () =>
  client.get("/auth/me").then((res) => res.data);
