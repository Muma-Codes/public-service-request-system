import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Footer from "./Footer";

/** Shell for logged-in pages: navbar, content area, footer. */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <AppNavbar />
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
