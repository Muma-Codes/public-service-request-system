import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import Card from "../../../components/ui/Card";
import { requestPath } from "../../../routes/paths";
import { formatDate } from "../../../utils/formatDate";
import StatusBadge from "./StatusBadge";

/** Summary of one request. The whole card links to the detail page. */
export default function RequestCard({ request, showCitizen = false }) {
  const {
    service_request_id: id,
    category,
    location,
    description,
    status,
    submitted_at: submittedAt,
    citizen,
  } = request;

  return (
    <Card as={Link} to={requestPath(id)} interactive>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {category?.service_category_name ?? "Service request"}
          </p>
          <p className="helper-text mt-0.5 flex items-center gap-1">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm">{description}</p>
      <p className="helper-text mt-3">
        Request #{id}, submitted {formatDate(submittedAt)}
        {showCitizen && citizen ? ` by ${citizen.name}` : ""}
      </p>
    </Card>
  );
}
