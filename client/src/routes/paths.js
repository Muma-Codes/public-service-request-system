// Central route paths.
export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  REQUESTS: "/requests",
  NEW_REQUEST: "/requests/new",
  REQUEST_DETAIL: "/requests/:id", // route pattern
  EDIT_REQUEST: "/requests/:id/edit", // route pattern
  PROFILE: "/profile",
  CATEGORIES: "/categories",
};

/** Link to one request: requestPath(12) -> '/requests/12' */
export const requestPath = (id) => `/requests/${id}`;
export const editRequestPath = (id) => `/requests/${id}/edit`;
