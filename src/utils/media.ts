/**
 * Determines whether a given media source represents a video.
 */
export const isVideoSource = (src?: string, mediaType?: string): boolean => {
  if (!src) return false;
  if (mediaType === 'video') return true;
  if (mediaType === 'image') return false;

  // Explicit video data URLs
  if (src.startsWith('data:video/')) return true;

  // Standard video file extensions (ignoring query strings and hash)
  const cleanUrl = src.split('?')[0].split('#')[0].toLowerCase();
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv'];
  if (videoExtensions.some(ext => cleanUrl.endsWith(ext))) {
    return true;
  }

  // If source contains video indicators
  if (cleanUrl.includes('video') || cleanUrl.includes('.mp4') || cleanUrl.includes('.webm')) {
    return true;
  }

  return false;
};

/**
 * Validates whether a text input is a usable web URL or path
 */
export const isValidMediaUrl = (input: string): boolean => {
  if (!input) return false;
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return true;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('idb://')) return true;
  return false;
};
