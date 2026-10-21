import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  isGeocodingConfigured,
  reverseGeocode,
} from "../../../api/geocoding.api";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { cx } from "../../../utils/classNames";
import { getCurrentPosition } from "../../../utils/geolocation";

/**
 * Location text box plus "Use my current location".
 * Flow: browser GPS -> Google Geocoding API -> readable address (editable).
 * If geocoding is unavailable we fill in the coordinates instead.
 */
export default function LocationField({ value, onChange, onLocated, error }) {
  const [isLocating, setIsLocating] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'info' | 'error', text }

  const handleLocate = async () => {
    setIsLocating(true);
    setMessage(null);
    try {
      const coords = await getCurrentPosition();
      let text = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
      let note =
        "We couldn’t find a street address, so we used your coordinates. You can edit this.";

      if (isGeocodingConfigured) {
        try {
          text = await reverseGeocode(coords);
          note = "Location found. Please check it and edit if needed.";
        } catch {
          // Keep the coordinates fallback
        }
      }
      onLocated(text);
      setMessage({ type: "info", text: note });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div>
      <Input
        label="Where is it?"
        name="location"
        autoComplete="off"
        hint="A street, estate or landmark. Or let us find where you are."
        value={value}
        onChange={onChange}
        error={error}
        required
      />
      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={handleLocate}
        loading={isLocating}
      >
        {!isLocating && <MapPin className="h-4 w-4" aria-hidden="true" />}
        {isLocating ? "Finding your location…" : "Use my current location"}
      </Button>
      {message && (
        <p
          role="status"
          className={cx(
            "mt-2 text-sm",
            message.type === "error" ? "text-love-700" : "text-ink-muted",
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
