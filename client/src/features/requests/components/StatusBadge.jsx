import { STATUS_CONFIG } from "../constants";
import { cx } from "../../../utils/classNames";

/**
 * Colour-coded status pill. Always shows an icon and a text label
 * so status is never communicated by colour alone.
 */
export default function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status];

  // Unknown status from the API: fail quietly with a neutral badge
  if (!config) {
    return (
      <span
        className={cx(
          "inline-flex rounded-full border border-line bg-cream-dark px-2.5 py-1 text-sm font-medium text-ink-muted",
          className,
        )}
      >
        {status}
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium",
        config.badge,
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {config.label}
    </span>
  );
}
