import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import useAuth from "../../../hooks/useAuth";
import { validateLogin } from "../../../utils/validators";
import useAuthForm from "../hooks/useAuthForm";

export default function LoginForm() {
  const { login } = useAuth();

  // After a successful login, PublicRoute redirects to the dashboard automatically
  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialValues: { phone_number: "", password: "" },
    validate: validateLogin,
    onSubmit: (v) =>
      login({ phone_number: v.phone_number.trim(), password: v.password }),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <Input
        label="Phone number"
        name="phone_number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0712 345 678"
        value={values.phone_number}
        onChange={handleChange}
        error={errors.phone_number}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button type="submit" fullWidth loading={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
