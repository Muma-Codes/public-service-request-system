import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { withdrawServiceRequest } from "../../../api/requests.api";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { editRequestPath } from "../../../routes/paths";

/** What the owner can do while a request is still Pending: edit it or withdraw it. */
export default function PendingRequestActions({ request, onWithdrawn }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <Card>
      <h2 className="section-title">Need to change something?</h2>
      <p className="helper-text mb-4 mt-1">
        While your request is Pending you can edit or withdraw it.
      </p>
      <div className="space-y-3">
        <Button
          as={Link}
          to={editRequestPath(request.service_request_id)}
          variant="secondary"
          fullWidth
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit request
        </Button>
        <Button
          variant="dangerGhost"
          fullWidth
          onClick={() => setConfirming(true)}
        >
          Withdraw request
        </Button>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Withdraw this request?"
          confirmLabel="Withdraw request"
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            await withdrawServiceRequest(request.service_request_id);
            onWithdrawn();
          }}
        >
          This permanently removes your request. This can’t be undone.
        </ConfirmDialog>
      )}
    </Card>
  );
}
