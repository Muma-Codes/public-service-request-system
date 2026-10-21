import Card from "../../../components/ui/Card";
import { formatDate } from "../../../utils/formatDate";

/** Read-only view of the logged-in citizen's details. */
export default function ProfileSummary({ citizen }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-xl font-semibold text-brand-700"
          aria-hidden="true"
        >
          {citizen.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{citizen.name}</p>
          <p className="helper-text">
            {citizen.is_admin ? "Administrator" : "Citizen"}
          </p>
        </div>
      </div>
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-ink-muted">Phone number</dt>
          <dd className="mt-0.5">{citizen.phone_number}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink-muted">Member since</dt>
          <dd className="mt-0.5">{formatDate(citizen.created_at)}</dd>
        </div>
      </dl>
    </Card>
  );
}
