import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Play, Pause, ChevronDown } from 'lucide-react';

interface StoryChapter {
  id: number;
  timeStart: number;
  timeEnd: number;
  tag: string;
  title: string;
  description: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    timeStart: 0.0,
    timeEnd: 2.5,
    tag: '01 / INDUSTRIAL PRINTING FACILITY',
    title: 'HIGH-PRECISION UV & ROLL PRODUCTION',
    description: 'Equipped with industrial flatbed engines and precision cutting systems in Doha, Qatar.',
  },
  {
    id: 2,
    timeStart: 2.5,
    timeEnd: 5.0,
    tag: '02 / ARCHITECTURAL SCALE',
    title: 'BUILDING WRAPS & FLEET BRANDING',
    description: 'Monumental exterior graphics and certified vehicle wrapping built for Qatar’s climate.',
  },
  {
    id: 3,
    timeStart: 5.0,
    timeEnd: 7.5,
    tag: '03 / MATERIAL MASTERY',
    title: 'ACRYLIC, WOOD & BESPOKE FABRICATION',
    description: 'Direct-to-substrate printing, CNC routing, and custom fabrication for luxury environments.',
  },
  {
    id: 4,
    timeStart: 7.5,
    timeEnd: 10.0,
    tag: '04 / TURNKEY EXECUTION',
    title: 'END-TO-END CORPORATE BRANDING',
    description: 'Comprehensive design, manufacturing, and white-glove installation across the State of Qatar.',
  },
];

interface ScrollVideoProps {
  onComplete: () => void;
}

export const ScrollVideo: React.FC<ScrollVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
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
      if (video && !isAutoPlaying && !isDismissing) {
        const targetP = targetProgressRef.current;
        const currentP = currentProgressRef.current;
        const diff = targetP - currentP;

        if (Math.abs(diff) > 0.0005) {
          const nextP = currentP + diff * 0.15;
          currentProgressRef.current = nextP;
          setProgress(nextP);

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
          setCurrentTime(nextTime);

          // If reached the end, automatically transition
          if (nextP >= 0.99) {
            handleFinish();
          }
        }
      } else if (video && isAutoPlaying && !isDismissing) {
        setCurrentTime(video.currentTime);
        if (video.duration) {
          const p = video.currentTime / video.duration;
          setProgress(p);
          if (p >= 0.98) {
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
  }, [duration, isAutoPlaying, isDismissing, handleFinish]);

  // Lock document body scroll while intro is showing
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Wheel scrubbing handler
  const handleWheel = (e: React.WheelEvent) => {
    if (isAutoPlaying || isDismissing) return;
    const delta = e.deltaY;
    const step = delta > 0 ? 0.04 : -0.04;
    const nextTarget = Math.max(0, Math.min(1, targetProgressRef.current + step));
    targetProgressRef.current = nextTarget;
  };

  // Touch scrubbing handler (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAutoPlaying || isDismissing) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    const step = (diff / window.innerHeight) * 1.5;
    const nextTarget = Math.max(0, Math.min(1, targetProgressRef.current + step));
    targetProgressRef.current = nextTarget;
  };

  // Toggle Auto-play
  const toggleAutoPlay = () => {
    if (!videoRef.current) return;
    if (isAutoPlaying) {
      videoRef.current.pause();
      setIsAutoPlaying(false);
      targetProgressRef.current = videoRef.current.currentTime / duration;
      currentProgressRef.current = targetProgressRef.current;
    } else {
      setIsAutoPlaying(true);
      videoRef.current.play().catch(() => {
        setIsAutoPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const activeChapter =
    CHAPTERS.find((c) => currentTime >= c.timeStart && currentTime < c.timeEnd) ||
    CHAPTERS[CHAPTERS.length - 1];

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
          {/* Fullscreen Video Background */}
          <video
            key={videoSrc}
            ref={videoRef}
            playsInline
            muted={isMuted}
            preload="auto"
            onEnded={handleFinish}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Cinematic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/40 pointer-events-none z-10" />

          {/* Top HUD Header */}
          <div className="absolute top-6 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 z-30 flex items-center justify-between pointer-events-auto">
            {/* Brand / Film Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BCD4] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BCD4]" />
              </span>
              <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white">
                FACE PRINTING • COMMERCIAL FILM
              </span>
            </div>

            {/* Controls: Audio Mute, AutoPlay & Enter Site */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 text-white transition-all shadow-lg cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#00BCD4] animate-pulse" />
                )}
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={toggleAutoPlay}
                title={isAutoPlaying ? 'Pause Film' : 'Auto Play Film'}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 text-white transition-all shadow-lg cursor-pointer"
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4 text-[#00BCD4]" />
                ) : (
                  <Play className="w-4 h-4 text-gray-300" />
                )}
              </button>

              {/* Instant Enter Site Button */}
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_2px_15px_rgba(0,188,212,0.4)] cursor-pointer"
              >
                <span>ENTER SITE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating Minimalist Story Typography (Bottom-Left) */}
          <div className="absolute bottom-20 sm:bottom-24 left-4 sm:left-12 right-4 sm:right-12 z-20 pointer-events-none max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-2 sm:space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00BCD4]" />
                  <span className="font-mono text-xs sm:text-sm text-[#00BCD4] tracking-[0.25em] uppercase font-bold">
                    {activeChapter.tag}
                  </span>
                </div>

                <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.05] drop-shadow-lg">
                  {activeChapter.title}
                </h1>

                <p className="text-gray-300 text-xs sm:text-base md:text-lg max-w-2xl leading-relaxed drop-shadow font-sans">
                  {activeChapter.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom HUD: Scrub Guidance, Chapter Progress Dots & Progress Line */}
          <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto">
            <div className="flex items-center justify-between px-4 sm:px-12 pb-3.5 text-[10px] sm:text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2 text-gray-300">
                <ChevronDown className="w-3.5 h-3.5 text-[#00BCD4] animate-bounce" />
                <span className="tracking-widest uppercase font-semibold">
                  SCROLL OR SWIPE TO SCRUB FILM
                </span>
              </div>

              {/* Chapter Pill Indicators */}
              <div className="flex items-center gap-2">
                {CHAPTERS.map((c) => {
                  const isActive =
                    currentTime >= c.timeStart && currentTime < c.timeEnd;
                  return (
                    <span
                      key={c.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-8 bg-[#00BCD4] shadow-[0_0_10px_rgba(0,188,212,0.8)]'
                          : 'w-2 bg-white/25'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Bottom Accent Glow Scrub Line */}
            <div className="w-full h-1 bg-white/10 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00BCD4] via-[#38E1FF] to-[#00BCD4] transition-all duration-75 shadow-[0_0_12px_rgba(0,188,212,0.9)]"
                style={{ width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
