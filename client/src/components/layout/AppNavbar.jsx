import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { PATHS } from "../../routes/paths";
import { cx } from "../../utils/classNames";
import Button from "../ui/Button";
import Brand from "./Brand";
import { ADMIN_LINKS, CITIZEN_LINKS } from "./navLinks";

/** Navbar for logged-in users. Links depend on the role; collapses to a menu below lg. */
export default function AppNavbar() {
  const { citizen, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = citizen.is_admin ? ADMIN_LINKS : CITIZEN_LINKS;
  const isActive = (link) =>
    link.isActive ? link.isActive(pathname) : pathname.startsWith(link.to);

  // Close the mobile menu after navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
  };

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Brand />
          <nav
            aria-label="Main"
            className="hidden h-16 items-stretch gap-6 lg:flex"
          >
            {links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex items-center border-b-2 text-sm font-medium transition-colors",
                    active
                      ? "border-brand-600 text-ink"
                      : "border-transparent text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-sm text-ink-muted">{citizen.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-lg text-ink transition-colors hover:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 lg:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line lg:hidden">
          <nav
            aria-label="Main mobile"
            className="mx-auto max-w-6xl px-4 py-2 sm:px-6"
          >
            {links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "block border-l-4 py-3 pl-3 text-base font-medium",
                    active
                      ? "border-brand-600 text-ink"
                      : "border-transparent text-ink-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-6">
            <span className="truncate text-sm text-ink-muted">
              {citizen.name}
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
