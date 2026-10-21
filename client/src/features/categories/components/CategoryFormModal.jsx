import { createCategory, renameCategory } from "../../../api/categories.api";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import useForm from "../../../hooks/useForm";

const FORM_ID = "category-form";

/** Add a category, or rename one when `category` is passed. */
export default function CategoryFormModal({ category, onClose, onSaved }) {
  const isEditing = Boolean(category);

  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: { name: category?.service_category_name ?? "" },
    validate: ({ name }) => {
      const trimmed = name.trim();
      if (!trimmed) return { name: "Category name is required." };
      if (trimmed.length > 50)
        return { name: "Category name must not exceed 50 characters." };
      return {};
    },
    onSubmit: async ({ name }) => {
      const saved = isEditing
        ? await renameCategory(category.service_category_id, name.trim())
        : await createCategory(name.trim());
      onSaved(saved);
      onClose();
    },
  });

  return (
    <Modal
      title={isEditing ? "Rename category" : "Add category"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save category"}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {submitError && <Alert variant="error">{submitError}</Alert>}
        <Input
          label="Category name"
          name="name"
          maxLength={50}
          placeholder="For example, Streetlights"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
      </form>
    </Modal>
  );
}
