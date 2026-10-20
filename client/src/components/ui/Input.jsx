import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cx } from "../../utils/classNames";

/**
 * Labelled text input with helper and error text.
 * Works with plain state or react-hook-form (`{...register('name')}`).
 *
 * Props: label, hint (helper text), error (message), required,
 * trailing (element shown inside the right edge, e.g. a button), plus any native input prop.
 * Errors are shown as text with an icon, never as colour alone.
 */
const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    required = false,
    trailing,
    id,
    className,
    type = "text",
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  // Point screen readers at whichever messages are currently shown
  const describedBy =
    [hint && !error && hintId, error && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-love-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            "h-11 w-full rounded-lg border bg-white px-3.5 text-base text-ink",
            "placeholder:text-ink-muted/60",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2",
            // Error and normal states differ in border and ring colour
            error
              ? "border-love-600 focus:ring-love-600/30"
              : "border-line hover:border-ink-muted/40 focus:border-brand-600 focus:ring-brand-600/30",
            "disabled:cursor-not-allowed disabled:bg-cream-dark disabled:text-ink-muted",
            trailing && "pr-12",
          )}
          {...rest}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0.5 flex items-center">
            {trailing}
          </div>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="helper-text mt-1.5">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-sm text-love-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default Input;
