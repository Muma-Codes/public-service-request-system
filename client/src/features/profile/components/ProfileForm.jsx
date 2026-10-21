import { useState } from "react";
import * as citizensApi from "../../../api/citizens.api";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Card, { CardHeader } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import useAuth from "../../../hooks/useAuth";
import useForm from "../../../hooks/useForm";
import { validateProfile } from "../../../utils/validators";

/** Edit name and phone number. Only the fields that changed are sent. */
export default function ProfileForm() {
  const { citizen, updateCitizen } = useAuth();
  const [notice, setNotice] = useState(null); // { variant, text }

  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: { name: citizen.name, phone_number: citizen.phone_number },
    validate: validateProfile,
    onSubmit: async (v) => {
      setNotice(null);
      const changes = {};
      if (v.name.trim() !== citizen.name) changes.name = v.name.trim();
      if (v.phone_number.replace(/[\s\-()]/g, "") !== citizen.phone_number)
        changes.phone_number = v.phone_number.trim();

      if (Object.keys(changes).length === 0) {
        setNotice({ variant: "info", text: "You haven’t changed anything." });
        return;
      }
      const updated = await citizensApi.updateCitizen(
        citizen.citizen_id,
        changes,
      );
      updateCitizen(updated);
      setNotice({
        variant: "success",
        text: "Your details have been updated.",
      });
    },
  });

  return (
    <Card padding="lg">
      <CardHeader title="Your details" />
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError && <Alert variant="error">{submitError}</Alert>}
        {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}

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
          hint="You log in with this number."
          value={values.phone_number}
          onChange={handleChange}
          error={errors.phone_number}
          required
        />
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
