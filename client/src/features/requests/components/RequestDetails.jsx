import { ExternalLink } from "lucide-react";
import Card from "../../../components/ui/Card";
import { formatDateTime } from "../../../utils/formatDate";
import { optimizeImage } from "../../../utils/image";

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

/** Everything the citizen submitted. Admins also see who submitted it. */
export default function RequestDetails({ request, isAdmin }) {
  const {
    category,
    location,
    description,
    image_url: imageUrl,
    submitted_at: submittedAt,
    citizen,
  } = request;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <Card padding="lg">
      <dl className="space-y-6">
        <Field label="Category">
          {category?.service_category_name ?? "Not available"}
        </Field>

        <Field label="Location">
          <p>{location}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link mt-1 inline-flex items-center gap-1 text-sm"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Field>

        <Field label="Description">
          <p className="whitespace-pre-wrap">{description}</p>
        </Field>

        {imageUrl && (
          <Field label="Photo">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the photo in full size"
            >
              <img
                src={optimizeImage(imageUrl)}
                alt="Photo of the issue, submitted with this request"
                loading="lazy"
                className="max-h-96 rounded-lg border border-line object-contain"
              />
            </a>
          </Field>
        )}

        <Field label="Submitted">{formatDateTime(submittedAt)}</Field>

        {isAdmin && citizen && (
          <Field label="Submitted by">
            {citizen.name}
            <span className="helper-text block">{citizen.phone_number}</span>
          </Field>
        )}
      </dl>
    </Card>
  );
}
