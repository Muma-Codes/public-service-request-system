import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AsyncBoundary from "../components/common/AsyncBoundary";
import PageHeader from "../components/common/PageHeader";
import Alert from "../components/ui/Alert";
import EditRequestForm from "../features/requests/components/EditRequestForm";
import { REQUEST_STATUS } from "../features/requests/constants";
import useRequestDetail from "../features/requests/hooks/useRequestDetail";
import useAuth from "../hooks/useAuth";
import { requestPath } from "../routes/paths";

/** Owners can edit their own request while it is Pending (the API enforces this too). */
export default function EditRequestPage() {
  const { id } = useParams();
  const { citizen } = useAuth();
  const { data: request, isLoading, error, reload } = useRequestDetail(id);

  const canEdit =
    request &&
    request.submitted_by === citizen.citizen_id &&
    request.status === REQUEST_STATUS.PENDING;

  return (
    <>
      <Link
        to={requestPath(id)}
        className="link mb-4 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the request
      </Link>
      <PageHeader title="Edit request" subtitle={`Request #${id}`} />

      <AsyncBoundary isLoading={isLoading} error={error} onRetry={reload}>
        {request &&
          (canEdit ? (
            <EditRequestForm
              key={request.service_request_id}
              request={request}
            />
          ) : (
            <Alert variant="warning">
              You can only edit your own requests, and only while they are
              Pending.
            </Alert>
          ))}
      </AsyncBoundary>
    </>
  );
}
