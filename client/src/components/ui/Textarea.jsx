import { forwardRef } from "react";
import { cx } from "../../utils/classNames";
import FormField, { controlClasses } from "./FormField";

const Textarea = forwardRef(function Textarea(
  { label, hint, error, required, id, className, rows = 5, ...rest },
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
        <textarea
          ref={ref}
          rows={rows}
          {...fieldProps}
          className={cx(controlClasses(error), "py-3")}
          {...rest}
        />
      )}
    </FormField>
  );
});

export default Textarea;
