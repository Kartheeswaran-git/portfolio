const DRIVE_FILE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([\w-]+)/,
  /drive\.google\.com\/open\?id=([\w-]+)/,
  /drive\.google\.com\/uc\?(?:[^#]*&)?id=([\w-]+)/,
  /drive\.google\.com\/thumbnail\?(?:[^#]*&)?id=([\w-]+)/,
  /lh3\.googleusercontent\.com\/d\/([\w-]+)/,
  /lh3\.googleusercontent\.com\/u\/\d+\/d\/([\w-]+)/,
  /[?&]id=([\w-]+)/,
];

export const getDriveFileId = (url) => {
  if (!url || typeof url !== "string") return null;

  for (const pattern of DRIVE_FILE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return url;

  const trimmedUrl = url.trim();
  const driveFileId = getDriveFileId(trimmedUrl);

  if (driveFileId) {
    return `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w2000`;
  }

  return trimmedUrl;
};

export const normalizeImageList = (images = []) =>
  images
    .map((image) => normalizeImageUrl(image))
    .filter((image) => typeof image === "string" && image.trim().length > 0);
