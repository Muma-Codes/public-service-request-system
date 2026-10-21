import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import { PATHS } from "../../../routes/paths";
import RequestCard from "../../requests/components/RequestCard";

const LIMIT = 5;

/** The latest few requests, with a link to the full list. */
export default function RecentRequests({ requests, isAdmin }) {
  return (
    <section aria-labelledby="recent-requests">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="recent-requests" className="section-title">
          Recent requests
        </h2>
        {requests.length > 0 && (
          <Link to={PATHS.REQUESTS} className="link text-sm font-medium">
            View all
          </Link>
        )}
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            isAdmin ? "No requests yet" : "You haven’t made any requests yet"
          }
          text={
            isAdmin
              ? "New requests from citizens will appear here."
              : "Report a problem and follow it here until it is resolved."
          }
          action={
            !isAdmin && (
              <Button as={Link} to={PATHS.NEW_REQUEST}>
                Request a service
              </Button>
            )
          }
        />
      ) : (
        <ul className="space-y-3">
          {requests.slice(0, LIMIT).map((request) => (
            <li key={request.service_request_id}>
              <RequestCard request={request} showCitizen={isAdmin} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
