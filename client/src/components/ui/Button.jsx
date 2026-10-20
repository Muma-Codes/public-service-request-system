import { forwardRef } from "react";
import { cx } from "../../utils/classNames";
import Spinner from "./Spinner";

/**
 * Button variants. Each one lists its states: default, hover, active, disabled.
 * Focus ring colour is defined per variant so it always contrasts with the fill.
 */
const VARIANTS = {
  // Default action: Login, Save, Submit
  primary: [
    "bg-brand-600 text-white",
    "hover:bg-brand-700",
    "active:bg-brand-800",
    "focus-visible:ring-brand-600",
    "disabled:bg-brand-100 disabled:text-brand-600/50",
  ],
  // The single hero action on a screen: "Request a service"
  accent: [
    "bg-hope-500 text-ink",
    "hover:bg-hope-600",
    "active:bg-hope-700 active:text-white",
    "focus-visible:ring-hope-500",
    "disabled:bg-hope-100 disabled:text-ink/40",
  ],
  // Secondary choices: Cancel, Back
  secondary: [
    "border border-brand-600 bg-white text-brand-600",
    "hover:bg-brand-50",
    "active:bg-brand-100",
    "focus-visible:ring-brand-600",
    "disabled:border-line disabled:bg-white disabled:text-ink-muted/50",
  ],
  // Low-emphasis: "View details"
  ghost: [
    "bg-transparent text-brand-600",
    "hover:bg-brand-50",
    "active:bg-brand-100",
    "focus-visible:ring-brand-600",
    "disabled:bg-transparent disabled:text-ink-muted/50",
  ],
  // Destructive only: always pair with a confirmation modal
  danger: [
    "bg-love-600 text-white",
    "hover:bg-love-700",
    "active:bg-love-700",
    "focus-visible:ring-love-600",
    "disabled:bg-love-50 disabled:text-love-600/50",
  ],
};

const SIZES = {
  md: "h-11 px-5 text-base", // 44px tap target (default)
  sm: "h-9 px-3 text-sm", // dense areas such as table rows
};

/**
 * Props:
 *  - variant: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'
 *  - size: 'md' | 'sm'
 *  - loading: shows a spinner, blocks clicks, sets aria-busy
 *  - fullWidth: stretches to the container (handy on mobile forms)
 *  - as: render another element/component, e.g. as={Link} to="/requests/new"
 */
const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    disabled = false,
    type = "button",
    className,
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const isNativeButton = Component === "button";

  return (
    <Component
      ref={ref}
      // Only native buttons accept `type` and `disabled`
      {...(isNativeButton
        ? { type, disabled: isDisabled }
        : { "aria-disabled": isDisabled || undefined })}
      aria-busy={loading || undefined}
      className={cx(
        // Shared layout and behaviour
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        "active:scale-[0.98] disabled:active:scale-100",
        "disabled:cursor-not-allowed",
        SIZES[size],
        VARIANTS[variant],
        fullWidth && "w-full",
        // Linked buttons must not look like text links
        !isNativeButton && "no-underline hover:no-underline",
        className,
      )}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </Component>
  );
});

export default Button;
