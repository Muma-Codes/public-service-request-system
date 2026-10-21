import { Pencil, Tags, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/formatDate";

/**
 * Rows of categories with rename and delete.
 * `counts` maps category id -> number of requests. Categories in use should not be deleted.
 * when an admin try to delete a category that is in use, we disable the button and say why.
 */
export default function CategoryList({
  categories,
  counts,
  onAdd,
  onEdit,
  onDelete,
}) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No categories yet"
        text="Add the first category so citizens can start requesting services."
        action={<Button onClick={onAdd}>Add category</Button>}
      />
    );
  }

  return (
    <Card padding="none">
      <ul className="divide-y divide-line">
        {categories.map((category) => {
          const inUse = counts[category.service_category_id] ?? 0;
          return (
            <li
              key={category.service_category_id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{category.service_category_name}</p>
                <p className="helper-text">
                  {inUse === 1 ? "1 request" : `${inUse} requests`}, added{" "}
                  {formatDate(category.added_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Rename
                </Button>
                <Button
                  variant="dangerGhost"
                  size="sm"
                  onClick={() => onDelete(category)}
                  disabled={inUse > 0}
                  title={
                    inUse > 0
                      ? "In use by service requests, so it can’t be deleted"
                      : undefined
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
