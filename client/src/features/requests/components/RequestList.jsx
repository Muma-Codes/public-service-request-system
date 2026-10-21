import RequestCard from "./RequestCard";

/** One page of request cards. `emptyState` is rendered when there is nothing to show. */
export default function RequestList({
  requests,
  showCitizen = false,
  emptyState,
}) {
  if (requests.length === 0) return emptyState;

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.service_request_id}>
          <RequestCard request={request} showCitizen={showCitizen} />
        </li>
      ))}
    </ul>
  );
}
