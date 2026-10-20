import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import RegisterForm from "../features/auth/components/RegisterForm";
import { PATHS } from "../routes/paths";

export default function RegisterPage() {
  return (
    <>
      <Card padding="lg">
        <h1 className="page-title">Create your account</h1>
        <p className="helper-text mb-6 mt-1">
          It takes a minute, and then you can request a service.
        </p>
        <RegisterForm />
      </Card>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to={PATHS.LOGIN} className="link font-medium">
          Log in
        </Link>
      </p>
    </>
  );
}
