import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

/** Input with a show/hide toggle, so citizens can check what they typed on a phone. */
const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="grid h-10 w-10 place-items-center rounded-md text-ink-muted transition-colors hover:bg-cream-dark hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
