import { Link } from "react-router-dom";
import AsyncBoundary from "../components/common/AsyncBoundary";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import CategoryBreakdown from "../features/dashboard/components/CategoryBreakdown";
import RecentRequests from "../features/dashboard/components/RecentRequests";
import StatusSummary from "../features/dashboard/components/StatusSummary";
import useAnalytics from "../features/dashboard/hooks/useAnalytics";
import useRequests from "../features/requests/hooks/useRequests";
import { REQUEST_STATUS } from "../features/requests/constants";
import useAuth from "../hooks/useAuth";
import { PATHS } from "../routes/paths";

/** Same page for both roles: (system-wide for admins, own for citizens). */
export default function DashboardPage() {
  const { citizen } = useAuth();
  const isAdmin = citizen.is_admin;
  const analytics = useAnalytics();
  const list = useRequests({ perPage: 5 }); // just the latest few for "Recent requests"

  const total = analytics.data?.total ?? 0;
  const firstName = citizen.name.split(" ")[0];

  const action = isAdmin ? (
    <Button
      as={Link}
      to={`${PATHS.REQUESTS}?status=${encodeURIComponent(REQUEST_STATUS.PENDING)}`}
    >
      Review pending requests
    </Button>
  ) : (
    <Button as={Link} to={PATHS.NEW_REQUEST} variant="accent">
      Request a service
    </Button>
  );

  return (
    <>
      <PageHeader
        title={isAdmin ? "Dashboard" : `Hello, ${firstName}`}
        subtitle={
          isAdmin
            ? `${total} ${total === 1 ? "request" : "requests"} across the whole system.`
            : `You have submitted ${total} ${total === 1 ? "request" : "requests"} so far.`
        }
        action={action}
      />

      <AsyncBoundary
        isLoading={analytics.isLoading || list.isLoading}
        error={analytics.error || list.error}
        onRetry={() => {
          analytics.reload();
          list.reload();
        }}
      >
        <div className="space-y-8">
          <StatusSummary byStatus={analytics.data?.by_status} />
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RecentRequests requests={list.requests} isAdmin={isAdmin} />
            </div>
            <div className="lg:col-span-2">
              <CategoryBreakdown items={analytics.data?.by_category} />
            </div>
          </div>
        </div>
      </AsyncBoundary>
    </>
  );
}
