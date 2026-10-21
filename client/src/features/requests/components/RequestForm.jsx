import { Link, useNavigate } from "react-router-dom";
import { submitServiceRequest } from "../../../api/requests.api";
import AsyncBoundary from "../../../components/common/AsyncBoundary";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Select from "../../../components/ui/Select";
import useForm from "../../../hooks/useForm";
import { PATHS, requestPath } from "../../../routes/paths";
import { validateServiceRequest } from "../../../utils/validators";
import useCategories from "../../categories/hooks/useCategories";
import useRequestImage from "../hooks/useRequestImage";
import RequestFields from "./RequestFields";

/** Form for a citizen to submit a new service request. */
export default function RequestForm() {
  const navigate = useNavigate();
  const {
    categories,
    isLoading,
    error: categoriesError,
    reload,
  } = useCategories();
  const image = useRequestImage();

  const form = useForm({
    initialValues: { category_id: "", location: "", description: "" },
    validate: validateServiceRequest,
    onSubmit: async (v) => {
      const imageUrl = await image.uploadIfNeeded();
      const created = await submitServiceRequest({ ...v, image_url: imageUrl });
      navigate(requestPath(created.service_request_id), {
        replace: true,
        state: { justSubmitted: true },
      });
    },
  });
  const {
    values,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = form;

  return (
    <Card padding="lg" className="max-w-2xl">
      <AsyncBoundary
        isLoading={isLoading}
        error={categoriesError}
        onRetry={reload}
      >
        {categories.length === 0 ? (
          <Alert variant="info">
            No service categories are available yet. Please check back soon.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {submitError && <Alert variant="error">{submitError}</Alert>}

            <Select
              label="What needs fixing?"
              name="category_id"
              value={values.category_id}
              onChange={handleChange}
              error={errors.category_id}
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option
                  key={category.service_category_id}
                  value={category.service_category_id}
                >
                  {category.service_category_name}
                </option>
              ))}
            </Select>

            <RequestFields form={form} image={image} />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button as={Link} to={PATHS.DASHBOARD} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit request"}
              </Button>
            </div>
          </form>
        )}
      </AsyncBoundary>
    </Card>
  );
}
