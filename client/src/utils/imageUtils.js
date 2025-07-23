/**
 * Generates complete image URL from partial path
 * @param {string} partialPath - Partial image path from database
 * @returns {string} Complete image URL
 */
export const ImageUrlSet = (partialPath) => {
  if (!partialPath) return "/default-profile.png"; // Fallback image

  // In development, use local images
  if (process.env.NODE_ENV === "development") {
    return `/images${partialPath.startsWith("/") ? "" : "/"}${partialPath}`;
  }

  // In production, use cloud storage/CDN
  return `https://your-storage-bucket.com${
    partialPath.startsWith("/") ? "" : "/"
  }${partialPath}`;
};

/**
 * Generates thumbnail version of image URL
 * @param {string} partialPath - Partial image path
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 */
export const generateThumbnailUrl = (
  partialPath,
  width = 200,
  height = 200
) => {
  const baseUrl = ImageUrlSet(partialPath);
  return `${baseUrl}?width=${width}&height=${height}&mode=crop`;
};
