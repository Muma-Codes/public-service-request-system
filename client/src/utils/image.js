/** Asks Cloudinary for a smaller, optimised version of an image. Other URLs pass through unchanged. */
export function optimizeImage(url, width = 900) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/"))
    return url;
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}
