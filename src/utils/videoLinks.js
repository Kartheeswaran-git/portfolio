export const normalizeVideoUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  const trimmedUrl = url.trim();

  // YouTube
  const ytMatch = trimmedUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = trimmedUrl.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Direct video files
  if (trimmedUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return trimmedUrl;
  }

  return trimmedUrl;
};

export const isDirectVideo = (url) => {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|webm|ogg)$/i.test(url.trim());
};
