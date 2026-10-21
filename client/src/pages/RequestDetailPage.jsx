import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AsyncBoundary from "../components/common/AsyncBoundary";
import PageHeader from "../components/common/PageHeader";
import Alert from "../components/ui/Alert";
import Card, { CardHeader } from "../components/ui/Card";
import { REQUEST_STATUS } from "../features/requests/constants";
import RequestDetails from "../features/requests/components/RequestDetails";
import StatusBadge from "../features/requests/components/StatusBadge";
import StatusTimeline from "../features/requests/components/StatusTimeline";
import StatusUpdatePanel from "../features/requests/components/StatusUpdatePanel";
import PendingRequestActions from "../features/requests/components/PendingRequestActions";
import useRequestDetail from "../features/requests/hooks/useRequestDetail";
import useAuth from "../hooks/useAuth";
import { PATHS } from "../routes/paths";

/** One request: details, status tracker and role-specific actions. */
export default function RequestDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { citizen } = useAuth();
  const {
    data: request,
    isLoading,
    error,
    reload,
    setData,
  } = useRequestDetail(id);

  const isAdmin = citizen.is_admin;
  const isOwner = request?.submitted_by === citizen.citizen_id;

  return (
    <>
      <Link
        to={PATHS.REQUESTS}
        className="link mb-4 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {isAdmin ? "Back to all requests" : "Back to my requests"}
      </Link>

      <AsyncBoundary isLoading={isLoading} error={error} onRetry={reload}>
        {request && (
          <>
            <PageHeader
              title={
                request.category?.service_category_name ?? "Service request"
              }
              subtitle={`Request #${request.service_request_id}`}
            />

            {state?.justSubmitted && (
              <Alert
                variant="success"
                title="Request submitted"
                className="mb-6"
              >
                We’ll update its status here as it moves forward.
              </Alert>
            )}

            {state?.justUpdated && (
              <Alert variant="success" className="mb-6">
                Your changes have been saved.
              </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RequestDetails request={request} isAdmin={isAdmin} />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader
                    title="Status"
                    action={<StatusBadge status={request.status} />}
                  />
                  <StatusTimeline request={request} />
                </Card>
                {isAdmin && (
                  <StatusUpdatePanel request={request} onUpdated={setData} />
                )}
                {isOwner && request.status === REQUEST_STATUS.PENDING && (
                  <PendingRequestActions
                    request={request}
                    onWithdrawn={() =>
                      navigate(PATHS.REQUESTS, { replace: true })
                    }
                  />
                )}
              </div>
            </div>
          </>
        )}
      </AsyncBoundary>
    </>
  );
}
