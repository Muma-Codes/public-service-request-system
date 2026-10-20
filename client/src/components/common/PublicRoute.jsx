import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PageLoader from "./PageLoader";
import { PATHS } from "../../routes/paths";

/** Logged-in citizens are redirected away from the homepage, login and register pages. */
export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated)
    return (
      <Navigate
        to={location.state?.from?.pathname || PATHS.DASHBOARD}
        replace
      />
    );
  return <Outlet />;
}
