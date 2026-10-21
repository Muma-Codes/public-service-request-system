import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/classNames";
import FormField, { controlClasses } from "./FormField";

/** Native select (best on phones) styled to match Input. Pass <option> children. */
const Select = forwardRef(function Select(
  { label, hint, error, required, id, className, children, ...rest },
  ref,
) {
  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
      className={className}
    >
      {(fieldProps) => (
        <div className="relative">
          <select
            ref={ref}
            {...fieldProps}
            className={cx(controlClasses(error), "h-11 appearance-none pr-10")}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
        </div>
      )}
    </FormField>
  );
});

export default Select;
