/** Quiet footer on a darker cream. */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-ink-muted sm:px-6">
        &copy; {new Date().getFullYear()} Public Service Request System. All
        rights reserved.
      </div>
    </footer>
  );
}
