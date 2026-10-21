import { useState } from "react";
import { getErrorMessage } from "../utils/errors";

/**
 * Shared form logic.
 *  - initialValues: starting field values
 *  - validate(values): returns { field: 'message' } (empty object when valid)
 *  - onSubmit(values): async; throw to show an error message above the form
 * setValue(name, value) changes a field from code (e.g. after "use my location").
 * reset(values) restores the form (defaults to the initial values).
 */
export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the person starts fixing it
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleChange = (event) =>
    setValue(event.target.name, event.target.value);

  const reset = (next = initialValues) => {
    setValues(next);
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    setValue,
    reset,
    handleSubmit,
  };
}
