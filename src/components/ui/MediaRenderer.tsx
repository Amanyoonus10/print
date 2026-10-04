import React, { useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';
import { isVideoSource } from '../../utils/media';

export interface MediaRendererProps {
  src: string;
  alt?: string;
  mediaType?: 'image' | 'video';
  className?: string;
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  showMutedIndicator?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = 'Media Exhibit',
  mediaType,
  className = 'w-full h-full object-cover',
  priority = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  showMutedIndicator = false,
  onClick,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = isVideoSource(src, mediaType);

  useEffect(() => {
    if (isVideo && videoRef.current) {
      // Strictly enforce muted playback (no sound) across all browsers
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          // Fallback if browser requires user gesture
        });
      }
    }
  }, [isVideo, src, autoPlay]);

  if (isVideo) {
    return (
      <div className="relative w-full h-full" onClick={onClick}>
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          className={className}
          style={style}
          title={alt}
        />
        {showMutedIndicator && (
          <div
            title="Video is playing with no sound"
            className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] pointer-events-none"
          >
            <VolumeX className="w-3 h-3 text-[#49C1DA]" />
            <span>Muted</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};
