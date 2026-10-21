import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { PATHS } from "../../../routes/paths";
import { cx } from "../../../utils/classNames";
import { STATUS_CONFIG, STATUS_ORDER } from "../../requests/constants";

/** One card per status. Each links to the requests list filtered by that status. */
export default function StatusSummary({ byStatus }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {STATUS_ORDER.map((status) => {
        const { label, icon: Icon, badge } = STATUS_CONFIG[status];
        return (
          <li key={status}>
            <Card
              as={Link}
              to={`${PATHS.REQUESTS}?status=${encodeURIComponent(status)}`}
              interactive
            >
              <div className="flex items-center gap-4">
                <span
                  className={cx(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-lg border",
                    badge,
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-3xl font-semibold leading-none">
                    {byStatus?.[status] ?? 0}
                  </p>
                  <p className="helper-text mt-1">{label}</p>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
