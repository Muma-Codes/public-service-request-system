import { useState } from "react";
import { getErrorMessage } from "../../utils/errors";
import Alert from "./Alert";
import Button from "./Button";
import Modal from "./Modal";

/**
 * Confirmation for destructive actions. `onConfirm` is async; if it throws,
 * the error is shown here. The parent unmounts the dialog when the action succeeds.
 */
export default function ConfirmDialog({
  title,
  children,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-ink-muted">{children}</p>
      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}
    </Modal>
  );
}
