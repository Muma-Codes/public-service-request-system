import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { PATHS } from "../routes/paths";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="page-title">We can’t find that page</h1>
        <p className="helper-text mb-6 mt-2">
          The link may be broken, or the page may have moved.
        </p>
        <Button as={Link} to={PATHS.HOME}>
          Go to the homepage
        </Button>
      </div>
    </div>
  );
}
