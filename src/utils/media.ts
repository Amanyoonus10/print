export const isVideoSource = (src?: string, mediaType?: string): boolean => {
  if (!src) return false;
  if (mediaType === 'video') return true;
  if (mediaType === 'image') return false;

  // Data URLs for video
  if (src.startsWith('data:video/')) return true;

  // Blob URLs if created as video
  if (src.startsWith('blob:video/')) return true;

  // File extensions (ignoring query strings and hash)
  const cleanUrl = src.split('?')[0].split('#')[0].toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv'];
  return videoExtensions.some(ext => cleanUrl.endsWith(ext));
};
