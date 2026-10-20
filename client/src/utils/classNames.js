/**
 * Joins class names, skipping falsy values.
 * cx('a', isActive && 'b', undefined) -> 'a b'
 */
export const cx = (...parts) => parts.filter(Boolean).join(" ");
