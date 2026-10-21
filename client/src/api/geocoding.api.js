import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Without a key we fall back to showing raw coordinates
export const isGeocodingConfigured = Boolean(API_KEY);

/**
 * Google Geocoding API: coordinates -> readable address.
 * Plain axios on purpose: our API client would attach the login token to a Google request.
 */
export async function reverseGeocode({ lat, lng }) {
  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: { latlng: `${lat},${lng}`, key: API_KEY },
    },
  );
  if (data.status !== "OK" || !data.results?.length) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }
  return data.results[0].formatted_address;
}
