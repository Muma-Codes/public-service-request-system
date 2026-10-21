import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { deleteCategory } from "../api/categories.api";
import AsyncBoundary from "../components/common/AsyncBoundary";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CategoryFormModal from "../features/categories/components/CategoryFormModal";
import CategoryList from "../features/categories/components/CategoryList";
import useCategories from "../features/categories/hooks/useCategories";
import useAnalytics from "../features/dashboard/hooks/useAnalytics";

/** Admin: add, rename and delete service categories. */
export default function CategoriesPage() {
  const { categories, isLoading, error, reload, setData } = useCategories();
  const analytics = useAnalytics();
  const [formFor, setFormFor] = useState(null); // null = closed, {} = add, {category} = rename
  const [toDelete, setToDelete] = useState(null);

  // Requests per category, from the analytics endpoint (categories with no requests are absent)
  const counts = useMemo(
    () =>
      Object.fromEntries(
        (analytics.data?.by_category ?? []).map((c) => [
          c.category_id,
          c.count,
        ]),
      ),
    [analytics.data],
  );

  const handleSaved = (saved) =>
    setData((list) => {
      const rest = (list ?? []).filter(
        (c) => c.service_category_id !== saved.service_category_id,
      );
      return [...rest, saved];
    });

  return (
    <>
      <PageHeader
        title="Service categories"
        subtitle="Citizens choose one of these when they request a service."
        action={
          <Button onClick={() => setFormFor({})}>
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add category
          </Button>
        }
      />

      <AsyncBoundary
        isLoading={isLoading || analytics.isLoading}
        error={error || analytics.error}
        onRetry={() => {
          reload();
          analytics.reload();
        }}
      >
        <CategoryList
          categories={categories}
          counts={counts}
          onAdd={() => setFormFor({})}
          onEdit={(category) => setFormFor({ category })}
          onDelete={setToDelete}
        />
      </AsyncBoundary>

      {formFor && (
        <CategoryFormModal
          category={formFor.category}
          onClose={() => setFormFor(null)}
          onSaved={handleSaved}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this category?"
          confirmLabel="Delete category"
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            await deleteCategory(toDelete.service_category_id);
            setData((list) =>
              list.filter(
                (c) => c.service_category_id !== toDelete.service_category_id,
              ),
            );
            setToDelete(null);
          }}
        >
          “{toDelete.service_category_name}” will be removed. This can’t be
          undone.
        </ConfirmDialog>
      )}
    </>
  );
}
