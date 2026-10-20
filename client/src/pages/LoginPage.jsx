import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import LoginForm from "../features/auth/components/LoginForm";
import { PATHS } from "../routes/paths";

export default function LoginPage() {
  return (
    <>
      <Card padding="lg">
        <h1 className="page-title">Welcome back</h1>
        <p className="helper-text mb-6 mt-1">
          Log in to request a service or check on your requests.
        </p>
        <LoginForm />
      </Card>
      <p className="mt-6 text-center text-sm text-ink-muted">
        New here?{" "}
        <Link to={PATHS.REGISTER} className="link font-medium">
          Create an account
        </Link>
      </p>
    </>
  );
}
