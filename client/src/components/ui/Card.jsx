import { cx } from "../../utils/classNames";

/**
 * White surface on the cream page.
 *  - interactive: adds hover border + shadow (use when the whole card is clickable,
 *    e.g. as={Link} to="/requests/12")
 *  - padding: 'md' (p-5) | 'lg' (p-6 md:p-8) | 'none' (for lists/tables that manage their own padding)
 */
const PADDING = { none: "", md: "p-5", lg: "p-6 md:p-8" };

export default function Card({
  as: Component = "div",
  interactive = false,
  padding = "md",
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={cx(
        "block rounded-xl border border-line bg-white shadow-card",
        PADDING[padding],
        interactive &&
          "transition duration-150 hover:border-brand-600 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Optional heading row for a card: title on the left, an action on the right. */
export function CardHeader({ title, action, className }) {
  return (
    <div
      className={cx("mb-4 flex items-center justify-between gap-3", className)}
    >
      <h2 className="section-title">{title}</h2>
      {action}
    </div>
  );
}
