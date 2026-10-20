import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "../../../utils/validators";
import { cx } from "../../../utils/classNames";

/** Live checklist under the password field. Each rule has an icon and text, not colour alone. */
export default function PasswordRequirements({ password }) {
  return (
    <ul className="mt-2 space-y-1" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const Icon = met ? Check : Circle;
        return (
          <li
            key={rule.id}
            className={cx(
              "flex items-center gap-2 text-sm",
              met ? "text-success-600" : "text-ink-muted",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{rule.label}</span>
            <span className="sr-only">{met ? "(done)" : "(not yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
