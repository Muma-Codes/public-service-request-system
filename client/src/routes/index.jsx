import { Routes, Route } from "react-router-dom";
import AdminRoute from "../components/common/AdminRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import PublicLayout from "../components/layout/PublicLayout";
import CategoriesPage from "../pages/CategoriesPage";
import DashboardPage from "../pages/DashboardPage";
import EditRequestPage from "../pages/EditRequestPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NewRequestPage from "../pages/NewRequestPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import RequestDetailPage from "../pages/RequestDetailPage";
import RequestsPage from "../pages/RequestsPage";
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

      {/* Logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
          <Route path={PATHS.REQUESTS} element={<RequestsPage />} />
          <Route path={PATHS.NEW_REQUEST} element={<NewRequestPage />} />
          <Route path={PATHS.REQUEST_DETAIL} element={<RequestDetailPage />} />
          <Route path={PATHS.EDIT_REQUEST} element={<EditRequestPage />} />
          <Route path={PATHS.PROFILE} element={<ProfilePage />} />

          {/* Admins only */}
          <Route element={<AdminRoute />}>
            <Route path={PATHS.CATEGORIES} element={<CategoriesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
