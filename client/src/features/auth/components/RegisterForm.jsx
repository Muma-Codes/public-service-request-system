import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import PasswordInput from "../../../components/ui/PasswordInput";
import useAuth from "../../../hooks/useAuth";
import { validateRegistration } from "../../../utils/validators";
import useAuthForm from "../hooks/useAuthForm";
import PasswordRequirements from "./PasswordRequirements";

export default function RegisterForm() {
  const { signup } = useAuth();

  // signup creates the account and logs the citizen in; PublicRoute then redirects.
  // confirm_password is only checked here and is never sent to the server.
  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialValues: {
      name: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    },
    validate: validateRegistration,
    onSubmit: (v) =>
      signup({
        name: v.name.trim(),
        phone_number: v.phone_number.trim(),
        password: v.password,
      }),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        maxLength={50}
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Phone number"
        name="phone_number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0712 345 678"
        hint="You’ll use this number to log in."
        value={values.phone_number}
        onChange={handleChange}
        error={errors.phone_number}
        required
      />

      <div>
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <PasswordRequirements password={values.password} />
      </div>

      <PasswordInput
        label="Confirm password"
        name="confirm_password"
        autoComplete="new-password"
        value={values.confirm_password}
        onChange={handleChange}
        error={errors.confirm_password}
        required
      />

      <Button type="submit" fullWidth loading={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
