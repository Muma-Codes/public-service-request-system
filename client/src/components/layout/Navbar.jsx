import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Brand from "./Brand";
import { PATHS } from "../../routes/paths";

/** Top bar for visitors who are not logged in. */
export default function Navbar() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Brand />
        <nav className="flex items-center gap-2" aria-label="Account">
          <Button as={Link} to={PATHS.LOGIN} variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to={PATHS.REGISTER} variant="secondary" size="sm">
            Sign up
          </Button>
        </nav>
      </div>
    </header>
  );
}
