import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { IMAGE_TYPES, MAX_IMAGE_MB } from "../../../api/cloudinary.api";
import Button from "../../../components/ui/Button";
import { optimizeImage } from "../../../utils/image";

/**
 * Optional photo picker with preview. Only holds the File; the upload happens on submit.
 *  - file / onChange: a newly chosen photo
 *  - existingUrl / onRemoveExisting: the request's current photo (edit mode)
 */
export default function ImageUpload({
  file,
  onChange,
  existingUrl = null,
  onRemoveExisting,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Create the preview URL in an effect so it is cleaned up correctly
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const openPicker = () => inputRef.current?.click();

  const handleSelect = (event) => {
    const selected = event.target.files?.[0];
    event.target.value = ""; // allow choosing the same file again
    if (!selected) return;

    if (!IMAGE_TYPES.includes(selected.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (selected.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(
        `That photo is larger than ${MAX_IMAGE_MB} MB. Please choose a smaller one.`,
      );
      return;
    }
    setError("");
    onChange(selected);
  };

  let content;
  if (file && preview) {
    content = (
      <div className="flex items-center gap-4 rounded-lg border border-line bg-white p-3">
        <img
          src={preview}
          alt="Preview of the selected photo"
          className="h-20 w-20 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="helper-text">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(null)}
          aria-label="Remove the selected photo"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Remove
        </Button>
      </div>
    );
  } else if (existingUrl) {
    content = (
      <div className="flex items-center gap-4 rounded-lg border border-line bg-white p-3">
        <img
          src={optimizeImage(existingUrl, 160)}
          alt="Current photo"
          className="h-20 w-20 rounded-md object-cover"
        />
        <p className="min-w-0 flex-1 text-sm font-medium">Current photo</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={openPicker}>
            Replace
          </Button>
          <Button
            variant="dangerGhost"
            size="sm"
            onClick={onRemoveExisting}
            aria-label="Remove the current photo"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <button
        type="button"
        onClick={openPicker}
        className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-line bg-white px-4 py-6 text-center transition-colors hover:border-brand-600 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        <ImagePlus className="h-6 w-6 text-brand-600" aria-hidden="true" />
        <span className="text-sm font-medium">Choose a photo</span>
        <span className="helper-text">
          JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB
        </span>
      </button>
    );
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">Photo (optional)</p>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        onChange={handleSelect}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      {content}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-love-700">
          {error}
        </p>
      )}
    </div>
  );
}
