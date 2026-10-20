import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cx } from "../../utils/classNames";

// Tinted background + coloured left border + icon. Text stays ink for readability.
const VARIANTS = {
  error: {
    icon: AlertCircle,
    box: "border-love-600 bg-love-50",
    iconColor: "text-love-600",
    role: "alert",
  },
  success: {
    icon: CheckCircle2,
    box: "border-success-600 bg-success-50",
    iconColor: "text-success-600",
    role: "status",
  },
  info: {
    icon: Info,
    box: "border-brand-600 bg-brand-50",
    iconColor: "text-brand-600",
    role: "status",
  },
  warning: {
    icon: AlertTriangle,
    box: "border-hope-500 bg-hope-50",
    iconColor: "text-hope-600",
    role: "status",
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  className,
}) {
  const { icon: Icon, box, iconColor, role } = VARIANTS[variant];

  return (
    <div
      role={role}
      className={cx("flex gap-3 rounded-lg border-l-4 p-4", box, className)}
    >
      <Icon
        className={cx("mt-0.5 h-5 w-5 shrink-0", iconColor)}
        aria-hidden="true"
      />
      <div className="text-sm text-ink">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
