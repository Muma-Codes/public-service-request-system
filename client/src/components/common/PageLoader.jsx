import Spinner from "../ui/Spinner";

/** Full-screen loader shown while the saved session is being restored. */
export default function PageLoader() {
  return (
    <div
      className="grid min-h-screen place-items-center text-brand-600"
      role="status"
      aria-label="Loading"
    >
      <Spinner className="h-8 w-8" />
    </div>
  );
}
