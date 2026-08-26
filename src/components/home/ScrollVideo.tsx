import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollVideoProps {
  onComplete: () => void;
}

export const ScrollVideo: React.FC<ScrollVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const [duration, setDuration] = useState<number>(10);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Viewport detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    }
  };

  // Complete and enter site
  const handleFinish = useCallback(() => {
    if (isDismissing) return;
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [isDismissing, onComplete]);

  // Smooth lerp loop for scrubbing
  useEffect(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && !isDismissing) {
        const targetP = targetProgressRef.current;
        const currentP = currentProgressRef.current;
        const diff = targetP - currentP;

        if (Math.abs(diff) > 0.0001) {
          // Ultra-smooth easing lerp
          const nextP = currentP + diff * 0.065;
          currentProgressRef.current = nextP;

          const nextTime = nextP * duration;
          try {
            if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
              (video as any).fastSeek(nextTime);
            } else {
              video.currentTime = nextTime;
            }
          } catch {
            video.currentTime = nextTime;
          }

          // If reached the end, automatically transition smoothly
          if (nextP >= 0.985 && targetP >= 0.99) {
            handleFinish();
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [duration, isDismissing, handleFinish]);

  // Lock document body scroll while intro is showing
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Wheel scrubbing handler (Continuous, slow, and smooth)
  const handleWheel = (e: React.WheelEvent) => {
    if (isDismissing) return;
    const delta = e.deltaY;
    // Granular proportional scaling for slow, luxurious scrubbing
    const step = delta * 0.00045;
    const nextTarget = Math.max(0, Math.min(1, targetProgressRef.current + step));
    targetProgressRef.current = nextTarget;
  };

  // Touch scrubbing handler (Mobile - slow and controlled)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDismissing) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    const step = (diff / window.innerHeight) * 0.45;
    const nextTarget = Math.max(0, Math.min(1, targetProgressRef.current + step));
    targetProgressRef.current = nextTarget;
  };

  const videoSrc = isMobile
    ? '/videos/commercial_mobile.mp4'
    : '/videos/commercial_desktop.mp4';

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          ref={containerRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.98, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#07080A] text-white flex items-center justify-center select-none overflow-hidden touch-none"
        >
          {/* Fullscreen Clean Video */}
          <video
            key={videoSrc}
            ref={videoRef}
            playsInline
            muted
            preload="auto"
            onEnded={handleFinish}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Close Button */}
          <button
            onClick={handleFinish}
            className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-mono text-xs uppercase tracking-wider border border-white/20 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>✕ Close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

