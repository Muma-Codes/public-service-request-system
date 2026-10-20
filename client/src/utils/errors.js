const FALLBACK = "Something went wrong. Please try again.";
const NETWORK =
  "We can’t reach the server. Check your internet connection and try again.";

/**
 * Turns an API error into a message people can read.
 * The Flask methods reply with plain-text messages; flask-jwt-extended replies with { msg }.
 */
export function getErrorMessage(error) {
  if (!error?.response) return error?.request ? NETWORK : FALLBACK;

  const data = error.response.data;
  // Ignore HTML error pages (e.g. a 500 from Flask debug mode)
  if (typeof data === "string" && data.trim() && !data.trim().startsWith("<"))
    return data;
  if (data?.msg) return data.msg;
  return FALLBACK;
}
