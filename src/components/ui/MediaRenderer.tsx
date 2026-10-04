import React, { useRef, useEffect, useState } from 'react';
import { VolumeX, Volume2, Film } from 'lucide-react';
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
  showMutedIndicator = true,
  mutedIndicatorPosition = 'top-right',
  onClick,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = isVideoSource(src, mediaType);

  // Audio control state
  const [isMuted, setIsMuted] = useState<boolean>(muted);

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
      v.muted = isMuted;
      v.defaultMuted = isMuted;
      v.playsInline = true;

      if (!isMuted) {
        v.volume = 1;
      }

      if (autoPlay) {
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback
          });
        }
      }
    }
  }, [isVideo, resolvedSrc, autoPlay, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    if (!nextMuted) {
      videoRef.current.volume = 1;
      videoRef.current.play().catch(() => {});
    }
    setIsMuted(nextMuted);
  };

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
          muted={isMuted}
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
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Click to play sound (Unmute)" : "Click to mute sound"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className={`absolute ${indicatorPosClass} z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white font-mono text-[11px] shadow-lg border border-white/20 transition-all cursor-pointer backdrop-blur-md active:scale-95 group/sound`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-300 group-hover/sound:text-white" />
                <span className="font-semibold text-gray-200">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#49C1DA] animate-pulse" />
                <span className="text-[#49C1DA] font-bold">Sound On</span>
              </>
            )}
          </button>
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
