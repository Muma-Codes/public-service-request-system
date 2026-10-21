import { PATHS } from "../../routes/paths";

// `isActive` is only needed when the default "path starts with link" rule is wrong:
// /requests/new must not light up "My requests".
export const CITIZEN_LINKS = [
  { to: PATHS.DASHBOARD, label: "Dashboard" },
  {
    to: PATHS.REQUESTS,
    label: "My requests",
    isActive: (pathname) =>
      pathname.startsWith(PATHS.REQUESTS) && pathname !== PATHS.NEW_REQUEST,
  },
  { to: PATHS.NEW_REQUEST, label: "New request" },
  { to: PATHS.PROFILE, label: "My profile" },
];

export const ADMIN_LINKS = [
  { to: PATHS.DASHBOARD, label: "Dashboard" },
  { to: PATHS.REQUESTS, label: "All requests" },
  { to: PATHS.CATEGORIES, label: "Categories" },
  { to: PATHS.PROFILE, label: "My profile" },
];
