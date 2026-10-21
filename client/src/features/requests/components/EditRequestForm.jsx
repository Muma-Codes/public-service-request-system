import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateServiceRequest } from "../../../api/requests.api";
import Alert from "../../../components/ui/Alert";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import useForm from "../../../hooks/useForm";
import { requestPath } from "../../../routes/paths";
import { validateRequestDetails } from "../../../utils/validators";
import useRequestImage from "../hooks/useRequestImage";
import RequestFields from "./RequestFields";

/** Edit a Pending request. Only the fields that changed are sent to the server. */
export default function EditRequestForm({ request }) {
  const navigate = useNavigate();
  const id = request.service_request_id;
  const image = useRequestImage(request.image_url);
  const [notice, setNotice] = useState("");

  const form = useForm({
    initialValues: {
      location: request.location,
      description: request.description,
    },
    validate: validateRequestDetails,
    onSubmit: async (v) => {
      setNotice("");
      const changes = {};
      if (v.location.trim() !== request.location)
        changes.location = v.location.trim();
      if (v.description.trim() !== request.description)
        changes.description = v.description.trim();

      const newImageUrl = await image.uploadIfNeeded();
      if (newImageUrl) changes.image_url = newImageUrl;
      else if (image.existingRemoved) changes.image_url = ""; // empty value clears the photo

      if (Object.keys(changes).length === 0) {
        setNotice("You haven’t changed anything.");
        return;
      }
      await updateServiceRequest(id, changes);
      navigate(requestPath(id), {
        replace: true,
        state: { justUpdated: true },
      });
    },
  });
  const { submitError, isSubmitting, handleSubmit } = form;

  return (
    <Card padding="lg" className="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {submitError && <Alert variant="error">{submitError}</Alert>}
        {notice && <Alert variant="info">{notice}</Alert>}

        {/* The API doesn't allow changing the category */}
        <div>
          <p className="mb-1.5 text-sm font-medium">Category</p>
          <p className="flex h-11 items-center rounded-lg border border-line bg-cream-dark px-3.5 text-ink-muted">
            {request.category?.service_category_name}
          </p>
          <p className="helper-text mt-1.5">
            The category can’t be changed. If it’s wrong, withdraw this request
            and submit a new one.
          </p>
        </div>

        <RequestFields form={form} image={image} />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button as={Link} to={requestPath(id)} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
