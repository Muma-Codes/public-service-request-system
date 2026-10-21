import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

/** Shows a loader, then an error with "Try again", then the content. */
export default function AsyncBoundary({ isLoading, error, onRetry, children }) {
  if (isLoading) {
    return (
      <div
        className="flex justify-center py-16 text-brand-600"
        role="status"
        aria-label="Loading"
      >
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="error">{error}</Alert>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  return children;
}
