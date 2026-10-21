import { useState } from "react";
import { updateRequestStatus } from "../../../api/requests.api";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Card, { CardHeader } from "../../../components/ui/Card";
import Select from "../../../components/ui/Select";
import { getErrorMessage } from "../../../utils/errors";
import { STATUS_CONFIG, STATUS_ORDER } from "../constants";

/** Admin only: move a request between Pending, In Progress and Resolved. */
export default function StatusUpdatePanel({ request, onUpdated }) {
  const [status, setStatus] = useState(request.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updateRequestStatus(
        request.service_request_id,
        status,
      );
      onUpdated(updated);
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update status" />
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {saved && <Alert variant="success">Status updated.</Alert>}
        <Select
          label="Status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setSaved(false);
          }}
        >
          {STATUS_ORDER.map((value) => (
            <option key={value} value={value}>
              {STATUS_CONFIG[value].label}
            </option>
          ))}
        </Select>
        <Button
          fullWidth
          onClick={handleSave}
          loading={saving}
          disabled={status === request.status}
        >
          {saving ? "Saving…" : "Save status"}
        </Button>
      </div>
    </Card>
  );
}
