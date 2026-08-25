import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowDown, ChevronDown } from 'lucide-react';

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

export const ScrollVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);

  // Auto detect mobile screen
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
      setIsVideoLoaded(true);
    }
  };

  // Smooth 60FPS lerp for video scrubbing
  useEffect(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && isVideoLoaded) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        if (Math.abs(diff) > 0.005) {
          const nextTime = current + diff * 0.35;
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
  }, [isVideoLoaded]);

  // Scroll listener
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

    setScrollProgress(progress);
    targetTimeRef.current = progress * duration;
  }, [duration]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipToContent = () => {
    const heroEl = document.getElementById('hero-section');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({
        top: scrollTop + rect.bottom,
        behavior: 'smooth',
      });
    }
  };

  const activeChapter =
    CHAPTERS.find((c) => currentTime >= c.timeStart && currentTime < c.timeEnd) ||
    CHAPTERS[CHAPTERS.length - 1];

  const videoSrc = isMobile
    ? '/videos/commercial_mobile.mp4'
    : '/videos/commercial_desktop.mp4';

  return (
    <section
      id="intro-film"
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#0A0B0D] text-white"
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#0A0B0D]">
        {/* Responsive Video Background */}
        <video
          key={videoSrc}
          ref={videoRef}
          playsInline
          muted={isMuted}
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Minimalist Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40 pointer-events-none z-10" />

        {/* Top Minimal Header HUD */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 right-4 sm:right-8 z-30 flex items-center justify-between pointer-events-auto">
          {/* Live Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BCD4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BCD4]" />
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-gray-200">
              COMMERCIAL FILM
            </span>
          </div>

          {/* Controls: Audio Mute & Skip to Site */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white transition-all shadow-md cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#00BCD4] animate-pulse" />
              )}
            </button>

            <button
              onClick={skipToContent}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
            >
              <span>SKIP INTRO</span>
              <ArrowDown className="w-3 h-3 text-[#00BCD4]" />
            </button>
          </div>
        </div>

        {/* Floating Minimalist Typography (Bottom-Left) */}
        <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-10 right-4 sm:right-10 z-20 pointer-events-none max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-2 sm:space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00BCD4]" />
                <span className="font-mono text-xs sm:text-sm text-[#00BCD4] tracking-[0.25em] uppercase font-bold">
                  {activeChapter.tag}
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight uppercase leading-[1.08] drop-shadow-md">
                {activeChapter.title}
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed drop-shadow-sm font-sans">
                {activeChapter.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Bottom Timeline Bar & Scroll Prompt */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto">
          {/* Scroll Down Prompt */}
          <div className="flex items-center justify-between px-4 sm:px-8 pb-3 text-[10px] sm:text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5 text-gray-300">
              <ChevronDown className="w-3.5 h-3.5 text-[#00BCD4] animate-bounce" />
              <span className="tracking-widest uppercase font-semibold">
                SCROLL TO SCRUB FILM
              </span>
            </div>

            {/* 4 Chapter Dots */}
            <div className="flex items-center gap-2">
              {CHAPTERS.map((c) => {
                const isActive =
                  currentTime >= c.timeStart && currentTime < c.timeEnd;
                return (
                  <span
                    key={c.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 bg-[#00BCD4] shadow-[0_0_8px_rgba(0,188,212,0.8)]'
                        : 'w-1.5 bg-white/30'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Thin Progress Line at bottom screen edge */}
          <div className="w-full h-1 bg-white/10 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00BCD4] to-[#38E1FF] transition-all duration-75 shadow-[0_0_10px_rgba(0,188,212,0.8)]"
              style={{ width: `${Math.min(Math.max(scrollProgress * 100, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
