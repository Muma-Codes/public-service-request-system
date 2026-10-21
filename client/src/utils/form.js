/**
 * Builds a form-encoded body (the Flask methods read request.form).
 * Empty values are skipped, except for field names listed in `keepEmpty`
 * (needed to clear a field, e.g. image_url='' removes a photo).
 */
export function toFormBody(fields, keepEmpty = []) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value === "" && !keepEmpty.includes(key)) return;
    body.append(key, value);
  });
  return body;
}
