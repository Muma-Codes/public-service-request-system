import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PATHS } from "../../routes/paths";

/** Nest inside ProtectedRoute. Non-admins are sent back to the dashboard. */
export default function AdminRoute() {
  const { citizen } = useAuth();
  return citizen?.is_admin ? (
    <Outlet />
  ) : (
    <Navigate to={PATHS.DASHBOARD} replace />
  );
}
