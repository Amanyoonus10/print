import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { isVideoSource } from '../../utils/media';
import { getCachedMediaUrl, resolveMediaUrl } from '../../utils/mediaStorage';

export interface LightboxItem {
  url: string;
  title: string;
  caption?: string;
  mediaType?: 'image' | 'video';
}

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  initialIndex?: number;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false); // Unmuted by default in fullscreen viewer for full experience
  const [resolvedSrc, setResolvedSrc] = useState<string>('');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
    }
  }, [isOpen, initialIndex, items.length]);

  const currentItem = items[currentIndex];
  const isVideo = currentItem ? isVideoSource(currentItem.url, currentItem.mediaType) : false;

  // Resolve media URL (supports IndexedDB idb://, data:video/, or standard paths)
  useEffect(() => {
    if (!isOpen || !currentItem) {
      setResolvedSrc('');
      return;
    }

    const cached = getCachedMediaUrl(currentItem.url);
    if (cached) {
      setResolvedSrc(cached);
      return;
    }

    if (currentItem.url.startsWith('idb://') || currentItem.url.startsWith('data:video/')) {
      resolveMediaUrl(currentItem.url)
        .then((url) => {
          setResolvedSrc(url);
        })
        .catch(() => {
          setResolvedSrc(currentItem.url);
        });
    } else {
      setResolvedSrc(currentItem.url);
    }
  }, [isOpen, currentItem]);

  // Video playback management on slide change
  useEffect(() => {
    if (isVideo && videoRef.current && resolvedSrc) {
      const v = videoRef.current;
      v.muted = isAudioMuted;
      v.volume = 1;
      v.play().catch(() => {
        // Fallback to muted autoplay if browser blocks unmuted audio
        v.muted = true;
        setIsAudioMuted(true);
        v.play().catch(() => {});
      });
    }
  }, [isVideo, resolvedSrc, isAudioMuted, currentIndex]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenMode(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation: Escape to close, Left/Right arrows
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Toggle browser native fullscreen
  const toggleNativeFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Toggle sound for videos
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isAudioMuted;
    videoRef.current.muted = nextMuted;
    setIsAudioMuted(nextMuted);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div
        ref={containerRef}
        className="fixed inset-0 z-[999999] flex flex-col justify-between bg-black/95 backdrop-blur-xl select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Control Bar */}
        <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#49C1DA] px-3 py-1 rounded-full bg-[#49C1DA]/15 border border-[#49C1DA]/30">
              {currentIndex + 1} / {items.length}
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
              {currentItem.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle (Video Only) */}
            {isVideo && (
              <button
                type="button"
                onClick={toggleAudio}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/15"
                title={isAudioMuted ? 'Turn Sound On' : 'Mute Sound'}
              >
                {isAudioMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-gray-300" />
                    <span className="hidden sm:inline">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[#49C1DA] animate-pulse" />
                    <span className="hidden sm:inline text-[#49C1DA]">Sound On</span>
                  </>
                )}
              </button>
            )}

            {/* Native Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleNativeFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15"
              title={isFullscreenMode ? 'Exit Fullscreen' : 'Enter Native Fullscreen'}
            >
              {isFullscreenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-all cursor-pointer border border-white/15"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Media Stage */}
        <div
          className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Previous Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md active:scale-90 hover:scale-105 shadow-xl"
              title="Previous Exhibit (Left Arrow)"
              aria-label="Previous Exhibit"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Media Content with Motion */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative max-w-[92vw] max-h-[82vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={resolvedSrc || undefined}
                autoPlay
                loop
                controls
                playsInline
                className="max-w-[92vw] max-h-[80vh] w-auto h-auto rounded-2xl shadow-2xl border border-white/10 object-contain bg-black"
                title={currentItem.title}
              />
            ) : (
              <img
                src={resolvedSrc || currentItem.url}
                alt={currentItem.title}
                className="max-w-[92vw] max-h-[80vh] w-auto h-auto rounded-2xl shadow-2xl border border-white/10 object-contain"
              />
            )}
          </motion.div>

          {/* Next Arrow Button */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md active:scale-90 hover:scale-105 shadow-xl"
              title="Next Exhibit (Right Arrow)"
              aria-label="Next Exhibit"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Bottom Details Bar */}
        <div className="relative z-30 px-4 sm:px-8 py-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center text-center">
          <h3 className="font-display font-extrabold text-base sm:text-xl text-white tracking-wide uppercase">
            {currentItem.title}
          </h3>
          {currentItem.caption && (
            <p className="font-mono text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl line-clamp-2">
              {currentItem.caption}
            </p>
          )}
          <span className="font-mono text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
            Use Left / Right arrow keys to navigate • Esc to exit
          </span>
        </div>
      </div>
    </AnimatePresence>
  );
};
