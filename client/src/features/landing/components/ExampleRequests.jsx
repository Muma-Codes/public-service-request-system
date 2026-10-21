import Card from "../../../components/ui/Card";
import StatusBadge from "../../requests/components/StatusBadge";
import { REQUEST_STATUS } from "../../requests/constants";

// Sample data only, to show visitors what tracking looks like
const EXAMPLES = [
  {
    title: "Streetlight not working",
    reported: "Reported 2 days ago",
    status: REQUEST_STATUS.IN_PROGRESS,
  },
  {
    title: "Garbage not collected",
    reported: "Reported today",
    status: REQUEST_STATUS.PENDING,
  },
  {
    title: "Water leak on the road",
    reported: "Reported last week",
    status: REQUEST_STATUS.RESOLVED,
  },
];

/** Preview of the request list, built from the real StatusBadge. */
export default function ExampleRequests() {
  return (
    <Card padding="none">
      <div className="border-b border-line px-5 py-4">
        <h2 className="section-title">Example requests</h2>
        <p className="helper-text">
          This is how your requests will appear in your account.
        </p>
      </div>
      <ul className="divide-y divide-line">
        {EXAMPLES.map((item) => (
          <li
            key={item.title}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="helper-text">{item.reported}</p>
            </div>
            <StatusBadge status={item.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
