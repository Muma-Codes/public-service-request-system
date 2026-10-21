import { useState } from "react";
import * as citizensApi from "../../../api/citizens.api";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Card, { CardHeader } from "../../../components/ui/Card";
import PasswordInput from "../../../components/ui/PasswordInput";
import useAuth from "../../../hooks/useAuth";
import useForm from "../../../hooks/useForm";
import { validatePasswordChange } from "../../../utils/validators";
import PasswordRequirements from "../../auth/components/PasswordRequirements";

const EMPTY = { current_password: "", new_password: "", confirm_password: "" };

/** Change password. The backend requires the current password for your own account. */
export default function PasswordForm() {
  const { citizen } = useAuth();
  const [saved, setSaved] = useState(false);

  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    reset,
    handleSubmit,
  } = useForm({
    initialValues: EMPTY,
    validate: validatePasswordChange,
    onSubmit: async (v) => {
      setSaved(false);
      await citizensApi.updateCitizen(citizen.citizen_id, {
        password: v.new_password,
        current_password: v.current_password,
      });
      reset(EMPTY);
      setSaved(true);
    },
  });

  return (
    <Card padding="lg">
      <CardHeader title="Change password" />
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError && <Alert variant="error">{submitError}</Alert>}
        {saved && (
          <Alert variant="success">Your password has been changed.</Alert>
        )}

        <PasswordInput
          label="Current password"
          name="current_password"
          autoComplete="current-password"
          value={values.current_password}
          onChange={handleChange}
          error={errors.current_password}
          required
        />
        <div>
          <PasswordInput
            label="New password"
            name="new_password"
            autoComplete="new-password"
            value={values.new_password}
            onChange={handleChange}
            error={errors.new_password}
            required
          />
          <PasswordRequirements password={values.new_password} />
        </div>
        <PasswordInput
          label="Confirm new password"
          name="confirm_password"
          autoComplete="new-password"
          value={values.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          required
        />
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Changing…" : "Change password"}
        </Button>
      </form>
    </Card>
  );
}
