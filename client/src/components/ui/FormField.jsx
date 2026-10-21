import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cx } from "../../utils/classNames";

/** Border, ring and disabled styles shared by Select and Textarea (Input has its own copy). */
export const controlClasses = (error) =>
  cx(
    "w-full rounded-lg border bg-white px-3.5 text-base text-ink transition-colors duration-150",
    "placeholder:text-ink-muted/60 focus:outline-none focus:ring-2",
    error
      ? "border-love-600 focus:ring-love-600/30"
      : "border-line hover:border-ink-muted/40 focus:border-brand-600 focus:ring-brand-600/30",
    "disabled:cursor-not-allowed disabled:bg-cream-dark disabled:text-ink-muted",
  );

/**
 * Label + hint + error wrapper. `children` is a function that receives the props
 * the control needs (id, aria-invalid, aria-describedby, required).
 */
export default function FormField({
  label,
  hint,
  error,
  required = false,
  id,
  className,
  children,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy =
    [hint && !error && hintId, error && errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
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

      {children({
        id: fieldId,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}

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
}
