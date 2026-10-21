import { Check } from "lucide-react";
import { cx } from "../../../utils/classNames";
import { formatDateTime } from "../../../utils/formatDate";
import { STATUS_CONFIG, STATUS_ORDER } from "../constants";

/** When did the request last enter this status? Uses the status history from the API. */
function enteredAt(request, status, index, isCurrent) {
  const history = request.status_history ?? [];
  const entry = [...history].reverse().find((h) => h.status === status);
  if (entry) return entry.changed_at;
  // Requests created before history existed: fall back to what we know
  if (index === 0) return request.submitted_at;
  return isCurrent ? request.updated_at : null;
}

/** Vertical progress tracker: Pending -> In Progress -> Resolved, each step with its date. */
export default function StatusTimeline({ request }) {
  const currentIndex = STATUS_ORDER.indexOf(request.status);

  return (
    <ol>
      {STATUS_ORDER.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const state =
          index < currentIndex
            ? "done"
            : index === currentIndex
              ? "current"
              : "upcoming";
        const Icon = state === "done" ? Check : config.icon;
        const isLast = index === STATUS_ORDER.length - 1;

        // Upcoming steps have no date yet (even if a status was reached earlier and then reversed)
        const date =
          state === "upcoming"
            ? null
            : enteredAt(request, status, index, state === "current");

        return (
          <li
            key={status}
            aria-current={state === "current" ? "step" : undefined}
            className={cx("relative flex gap-4", !isLast && "pb-8")}
          >
            {/* Connector to the next step */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={cx(
                  "absolute bottom-0 left-4 top-8 -ml-px w-0.5",
                  state === "done" ? "bg-brand-600" : "bg-line",
                )}
              />
            )}
            <span
              className={cx(
                "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                state === "done" && "border-brand-600 bg-brand-600 text-white",
                state === "current" && config.badge,
                state === "upcoming" && "border-line bg-white text-ink-muted",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p
                className={cx(
                  "font-medium",
                  state === "upcoming" && "text-ink-muted",
                )}
              >
                {config.label}
                <span className="sr-only">
                  {" "}
                  ({state === "done" ? "completed" : state})
                </span>
              </p>
              {state === "current" && (
                <p className="helper-text">{config.description}</p>
              )}
              {date && (
                <p className="helper-text">
                  {config.eventLabel} {formatDateTime(date)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
