import { useRef, useState } from "react";
import { uploadImage } from "../../../api/cloudinary.api";

/**
 * Photo state shared by the create and edit forms.
 * Pass the request's current image_url when editing.
 */
export default function useRequestImage(currentUrl = null) {
  const [file, setFile] = useState(null);
  const [keepCurrent, setKeepCurrent] = useState(Boolean(currentUrl));
  // Remember the uploaded URL so a retry after a failed submit doesn't upload the photo twice
  const uploaded = useRef({ file: null, url: null });

  /** Uploads the chosen photo (once). Returns its URL, or undefined when no new photo was chosen. */
  const uploadIfNeeded = async () => {
    if (!file) return undefined;
    if (uploaded.current.file !== file)
      uploaded.current = { file, url: await uploadImage(file) };
    return uploaded.current.url;
  };

  return {
    file,
    setFile,
    existingUrl: keepCurrent ? currentUrl : null,
    removeExisting: () => setKeepCurrent(false),
    // True when there was a photo and the person removed it (and did not pick a new one)
    existingRemoved: Boolean(currentUrl) && !keepCurrent,
    uploadIfNeeded,
  };
}
