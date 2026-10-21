const MESSAGES = {
  1: "Location access is blocked. Allow it in your browser settings, or type the address instead.",
  2: "We couldn’t work out your location. Please type the address instead.",
  3: "Finding your location took too long. Try again, or type the address.",
};

/** Promise wrapper around the browser's Geolocation API. Resolves { lat, lng }. */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Your browser can’t share your location. Please type the address instead.",
        ),
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => reject(new Error(MESSAGES[error.code] || MESSAGES[2])),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}
