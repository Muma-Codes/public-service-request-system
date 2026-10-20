import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PageLoader from "./PageLoader";
import { PATHS } from "../../routes/paths";

/** Only logged-in citizens get through; everyone else is sent to the login page. */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  // Remember where they were heading so login can send them back
  if (!isAuthenticated)
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  return <Outlet />;
}
