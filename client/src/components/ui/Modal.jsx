import { useEffect, useId, useRef } from "react";

/**
 * Accessible dialog built on the native <dialog> element
 * (focus trapping, Esc to close and the backdrop come from the browser).
 * Mount it only while it should be visible: {open && <Modal onClose={...} />}.
 */
export default function Modal({ title, onClose, children, footer }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself
      onClick={(event) => event.target === ref.current && onClose()}
      className="w-[calc(100%-2rem)] max-w-md rounded-xl border border-line bg-white p-0 text-ink shadow-card-hover backdrop:bg-ink/40"
    >
      <div className="p-6">
        <h2 id={titleId} className="section-title">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
      {footer && (
        <div className="flex flex-col-reverse gap-3 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      )}
    </dialog>
  );
}
