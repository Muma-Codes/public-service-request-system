/** Friendly empty screen: icon, one sentence, one action. */
export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
      {Icon && (
        <Icon className="mx-auto h-10 w-10 text-ink-muted" aria-hidden="true" />
      )}
      <h3 className="mt-4 font-semibold">{title}</h3>
      {text && <p className="helper-text mx-auto mt-1 max-w-sm">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
