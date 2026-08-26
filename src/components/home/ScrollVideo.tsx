import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

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
  const [progressPercent, setProgressPercent] = useState<number>(0);

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

  // Smooth 60fps lerp loop for scrubbing
  useEffect(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && !isDismissing) {
        const targetP = targetProgressRef.current;
        const currentP = currentProgressRef.current;
        const diff = targetP - currentP;

        if (Math.abs(diff) > 0.0001) {
          // Ultra-smooth easing lerp
          const nextP = currentP + diff * 0.085;
          currentProgressRef.current = nextP;
          setProgressPercent(Math.min(100, Math.round(nextP * 100)));

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
          if (nextP >= 0.97 && targetP >= 0.98) {
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

  // Wheel scrubbing handler (Continuous, silky, and smooth)
  const handleWheel = (e: React.WheelEvent) => {
    if (isDismissing) return;
    const delta = e.deltaY;
    const step = delta * 0.0006;
    const nextTarget = Math.max(0, Math.min(1, targetProgressRef.current + step));
    targetProgressRef.current = nextTarget;
  };

  // Touch scrubbing handler (Mobile - smooth and responsive)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDismissing) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    const step = (diff / window.innerHeight) * 0.65;
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
          {/* Fullscreen Video */}
          <video
            key={videoSrc}
            ref={videoRef}
            playsInline
            muted
            preload="auto"
            onEnded={handleFinish}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 pointer-events-none"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Top Brand & Skip Pill */}
          <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#00BCD4] animate-pulse" />
              <span className="font-mono text-xs text-white uppercase tracking-widest font-bold">
                FACE PRINTING SERVICES
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(0,188,212,0.4)] cursor-pointer"
            >
              <span>Skip to Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom HUD: Scroll Indicator & Progress Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="w-5 h-5 rounded-full bg-[#00BCD4]/20 border border-[#00BCD4] flex items-center justify-center">
                <ArrowDown className="w-3 h-3 text-[#00BCD4] animate-bounce" />
              </div>
              <span className="font-mono text-xs tracking-[0.25em] text-white font-bold uppercase">
                SCROLL TO EXPLORE • {progressPercent}%
              </span>
            </div>

            {/* Slim Cyan Progress Line */}
            <div className="w-48 h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#00BCD4] transition-all duration-100 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

