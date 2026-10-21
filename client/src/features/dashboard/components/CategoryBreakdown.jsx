import Card, { CardHeader } from "../../../components/ui/Card";

/** Requests per category as simple bars. The count is always written out. */
export default function CategoryBreakdown({ items = [] }) {
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;

  return (
    <Card>
      <CardHeader title="Requests by category" />
      {sorted.length === 0 ? (
        <p className="helper-text">Nothing to show yet.</p>
      ) : (
        <ul className="space-y-4">
          {sorted.map((item) => (
            <li key={item.category_id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{item.category_name}</span>
                <span className="text-ink-muted">{item.count}</span>
              </div>
              <div
                className="mt-1.5 h-2 rounded-full bg-brand-100"
                aria-hidden="true"
              >
                <div
                  className="h-2 rounded-full bg-brand-600"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
