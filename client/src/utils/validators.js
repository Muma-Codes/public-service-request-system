// Client-side checks give quick feedback. The server stays the final authority.
// These rules mirror the Flask validators (clean_name, normalize_phone_number, validate_password).

// Kenyan mobile: 07XXXXXXXX, 01XXXXXXXX or +2547XXXXXXXX, +2541XXXXXXXX (13 chars with +254)
const PHONE_PATTERN = /^(?:0|\+254)[17]\d{8}$/;

/** Drops fields without an error so `Object.keys(errors).length` means "has errors". */
const compact = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

// Single source for the password rules: used for validation and for the live checklist
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    message: "Password must be at least 8 characters long.",
    test: (p) => p.length >= 8,
  },
  {
    id: "letter",
    label: "A letter",
    message: "Password must contain at least one letter.",
    test: (p) => /[A-Za-z]/.test(p),
  },
  {
    id: "digit",
    label: "A number",
    message: "Password must contain at least one digit.",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "A special character, like ! or @",
    message: "Password must contain at least one special character.",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const validatePhone = (value) => {
  // The backend ignores spaces, dashes and brackets
  const phone = value.replace(/[\s\-()]/g, "");
  if (!phone) return "Enter your phone number.";
  if (!PHONE_PATTERN.test(phone))
    return "Enter a valid phone number, for example 0712 345 678 or +254 712 345 678.";
  return undefined;
};

const validatePassword = (value) => {
  if (!value) return "Choose a password.";
  return PASSWORD_RULES.find((rule) => !rule.test(value))?.message;
};

export const validateLogin = (values) =>
  compact({
    // Login only checks presence, so the server decides what counts as valid
    phone_number: values.phone_number.trim()
      ? undefined
      : "Enter your phone number.",
    password: values.password ? undefined : "Enter your password.",
  });

export const validateRegistration = (values) => {
  const name = values.name.trim();
  return compact({
    name: !name
      ? "Enter your full name."
      : name.length > 50
        ? "Name must not exceed 50 characters."
        : undefined,
    phone_number: validatePhone(values.phone_number),
    password: validatePassword(values.password),
    confirm_password: !values.confirm_password
      ? "Re-enter your password."
      : values.confirm_password !== values.password
        ? "Passwords don’t match."
        : undefined,
  });
};
