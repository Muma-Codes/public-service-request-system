import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import PublicRoute from "../components/common/PublicRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import { PATHS } from "./paths";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Visitors only: logged-in citizens are redirected to the dashboard */}
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path={PATHS.HOME} element={<LandingPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Logged-in citizens only */}
      <Route element={<ProtectedRoute />}>
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
