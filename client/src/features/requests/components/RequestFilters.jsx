import Select from "../../../components/ui/Select";
import { cx } from "../../../utils/classNames";
import { STATUS_CONFIG, STATUS_ORDER } from "../constants";

/** Status buttons and a category dropdown. The server does the filtering. */
export default function RequestFilters({
  status,
  categoryId,
  categories,
  onChange,
}) {
  const tabs = [
    { value: "", label: "All" },
    ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_CONFIG[s].label })),
  ];

  return (
    <div className="mb-6 space-y-4">
      <div
        role="group"
        aria-label="Filter by status"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.label}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onChange({ status: tab.value, category: categoryId })
              }
              className={cx(
                "h-10 rounded-lg border px-4 text-sm font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-white text-ink hover:bg-brand-50",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <Select
        label="Category"
        value={categoryId}
        onChange={(event) => onChange({ status, category: event.target.value })}
        className="max-w-xs"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option
            key={category.service_category_id}
            value={category.service_category_id}
          >
            {category.service_category_name}
          </option>
        ))}
      </Select>
    </div>
  );
}
