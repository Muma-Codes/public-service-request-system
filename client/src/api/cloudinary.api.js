import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isUploadConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_MB = 5;

/**
 * Uploads a photo straight to Cloudinary (unsigned preset) and returns its https URL.
 */
export async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      body,
    );
    return data.secure_url;
  } catch (error) {
    error.userMessage =
      "We couldn’t upload your photo. Check your connection, or remove the photo and submit without it.";
    throw error;
  }
}
