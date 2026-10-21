import { isUploadConfigured } from "../../../api/cloudinary.api";
import Textarea from "../../../components/ui/Textarea";
import ImageUpload from "./ImageUpload";
import LocationField from "./LocationField";

/**
 * The fields a citizen can fill in or edit: location, description, photo.
 * `form` is the object returned by useForm; `image` comes from useRequestImage.
 */
export default function RequestFields({ form, image }) {
  const { values, errors, handleChange, setValue } = form;

  return (
    <>
      <LocationField
        value={values.location}
        onChange={handleChange}
        onLocated={(text) => setValue("location", text)}
        error={errors.location}
      />

      <Textarea
        label="Describe the problem"
        name="description"
        hint="Tell us what is wrong and anything that helps us find it."
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        required
      />

      {isUploadConfigured && (
        <ImageUpload
          file={image.file}
          onChange={image.setFile}
          existingUrl={image.existingUrl}
          onRemoveExisting={image.removeExisting}
        />
      )}
    </>
  );
}
