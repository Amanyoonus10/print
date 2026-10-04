import React, { useRef, useEffect, useState } from 'react';
import { VolumeX, Film } from 'lucide-react';
import { isVideoSource } from '../../utils/media';
import { getCachedMediaUrl, resolveMediaUrl } from '../../utils/mediaStorage';

export interface MediaRendererProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  mediaType?: 'image' | 'video';
  className?: string;
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  showMutedIndicator?: boolean;
  mutedIndicatorPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = 'Media Exhibit',
  fallbackSrc,
  mediaType,
  className = 'w-full h-full object-cover',
  priority = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  showMutedIndicator = false,
  mutedIndicatorPosition = 'top-right',
  onClick,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = isVideoSource(src, mediaType);

  // Instant sync cache hit if available
  const initialResolved = getCachedMediaUrl(src) || (src.startsWith('idb://') ? '' : src);
  const [resolvedSrc, setResolvedSrc] = useState<string>(initialResolved);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Asynchronously resolve idb:// or data:video/ into a hardware-streamed blob: URL
  useEffect(() => {
    let isCancelled = false;
    setHasError(false);

    if (!src) {
      setResolvedSrc('');
      return;
    }

    const cached = getCachedMediaUrl(src);
    if (cached) {
      setResolvedSrc(cached);
      return;
    }

    if (src.startsWith('idb://') || src.startsWith('data:video/')) {
      resolveMediaUrl(src)
        .then((url) => {
          if (!isCancelled && url) {
            setResolvedSrc(url);
          }
        })
        .catch(() => {
          if (!isCancelled) setHasError(true);
        });
    } else {
      setResolvedSrc(src);
    }

    return () => {
      isCancelled = true;
    };
  }, [src]);

  // Video playback enforcement and hardware acceleration
  useEffect(() => {
    if (isVideo && videoRef.current && resolvedSrc) {
      const v = videoRef.current;
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;

      if (autoPlay) {
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser policy restriction fallback (e.g. low power mode)
          });
        }
      }
    }
  }, [isVideo, resolvedSrc, autoPlay]);

  // Error handling: if video fails to load, try fallbackSrc if provided
  if (isVideo && hasError) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          style={style}
          onClick={onClick}
        />
      );
    }

    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-4 text-center ${className}`}
        style={style}
        onClick={onClick}
      >
        <Film className="w-8 h-8 text-gray-500 mb-2 animate-pulse" />
        <span className="text-xs font-mono font-medium text-gray-300">Video source unavailable</span>
        <span className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate">{alt}</span>
      </div>
    );
  }

  const indicatorPosClass = {
    'top-right': 'top-3 right-3',
    'bottom-right': 'bottom-3 right-3',
    'top-left': 'top-3 left-3',
    'bottom-left': 'bottom-3 left-3',
  }[mutedIndicatorPosition];

  if (isVideo) {
    return (
      <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
        <video
          ref={videoRef}
          src={resolvedSrc || undefined}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload="auto"
          disablePictureInPicture
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} ${!isLoaded && !hasError ? 'transition-opacity duration-300' : ''}`}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            ...style,
          }}
          title={alt}
        />

        {showMutedIndicator && (
          <div
            title="Exhibiting with no sound (Smooth muted loop)"
            className={`absolute ${indicatorPosClass} z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] pointer-events-none select-none shadow-sm`}
          >
            <VolumeX className="w-3 h-3 text-[#49C1DA]" />
            <span>No Sound</span>
          </div>
        )}
      </div>
    );
  }

  // Image rendering with fallback
  return (
    <img
      src={resolvedSrc || src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        if (fallbackSrc && resolvedSrc !== fallbackSrc) {
          setResolvedSrc(fallbackSrc);
        }
      }}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};
