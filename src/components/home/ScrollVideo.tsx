import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Smartphone,
  Monitor,
  Sparkles,
  ChevronDown,
  ArrowDownRight,
  Film,
  Maximize2
} from 'lucide-react';

interface Milestone {
  id: number;
  timeStart: number;
  timeEnd: number;
  chapter: string;
  badge: string;
  title: string;
  subtitle: string;
  highlights: string[];
}

const MILESTONES: Milestone[] = [
  {
    id: 1,
    timeStart: 0.0,
    timeEnd: 2.5,
    chapter: '01 / INDUSTRIAL PRINTING',
    badge: 'Doha HQ Facility',
    title: 'HIGH-PRECISION UV & ROLL-TO-ROLL PRODUCTION',
    subtitle: 'Equipped with industrial UV flatbeds, laser cutting, and large-format printing engines in Doha, Qatar.',
    highlights: ['Micro-Dot Precision', 'Certified UV Resistance', 'High-Speed Turnaround'],
  },
  {
    id: 2,
    timeStart: 2.5,
    timeEnd: 5.0,
    chapter: '02 / ARCHITECTURAL SCALE',
    badge: 'Signage & Fleet',
    title: 'LARGE-FORMAT VISUALS & VEHICLE WRAPPING',
    subtitle: 'From monumental building wraps to commercial vehicle fleets, engineered for Qatar’s extreme climate.',
    highlights: ['Cast Vehicle Vinyl', 'Building Graphics', 'Flawless 3D Finish'],
  },
  {
    id: 3,
    timeStart: 5.0,
    timeEnd: 7.5,
    chapter: '03 / MATERIAL MASTERY',
    badge: 'Rigid Substrates',
    title: 'ACRYLIC, WOOD, METAL & BESPOKE FABRICATION',
    subtitle: 'Direct-to-substrate flatbed printing, CNC routing, and custom fabrication for luxury branding.',
    highlights: ['Multi-Surface Inks', 'CNC & Laser Router', 'Luxury Tactile Texture'],
  },
  {
    id: 4,
    timeStart: 7.5,
    timeEnd: 10.0,
    chapter: '04 / TURNKEY EXECUTION',
    badge: 'State of Qatar',
    title: 'TRUSTED BY LEADING BRANDS & ENTERPRISES',
    subtitle: 'Delivering end-to-end design, high-volume production, and precision installation across Qatar.',
    highlights: ['Doha Certified Team', 'White-Glove Delivery', 'CR: 191338'],
  },
];

export const ScrollVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // States
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);
  const [deviceOverride, setDeviceOverride] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);
  const isAutoPlayingRef = useRef<boolean>(false);

  // Determine effective mobile mode
  const effectiveIsMobile = deviceOverride === 'auto' ? isMobileViewport : deviceOverride === 'mobile';

  // Responsive viewport detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Update duration when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
      setIsVideoLoaded(true);
    }
  };

  // 60FPS Lerp Animation Loop for Smooth Scrubbing
  useEffect(() => {
    const loop = () => {
      const video = videoRef.current;
      if (video && !isAutoPlayingRef.current && isVideoLoaded) {
        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        // Smoothly interpolate towards target time
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
      } else if (video && isAutoPlayingRef.current) {
        setCurrentTime(video.currentTime);
        if (video.duration) {
          setScrollProgress(video.currentTime / video.duration);
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

  // Scroll listener to update target time
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isAutoPlayingRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) return;

    // Calculate normalized progress (0.0 to 1.0)
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

  // Toggle Mute / Sound
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle Auto-play / Manual Scroll Scrub
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      isAutoPlayingRef.current = false;
      setIsPlaying(false);
      targetTimeRef.current = videoRef.current.currentTime;
    } else {
      isAutoPlayingRef.current = true;
      setIsPlaying(true);
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
        isAutoPlayingRef.current = false;
      });
    }
  };

  // Fullscreen video toggle
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Jump to specific chapter
  const jumpToChapter = (timeStart: number) => {
    if (!containerRef.current) return;

    const targetProgress = timeStart / duration;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScrollY = scrollTop + rect.top + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });

    targetTimeRef.current = timeStart;
    if (videoRef.current) {
      videoRef.current.currentTime = timeStart;
    }
  };

  // Skip Intro / Scroll directly to main landing page
  const scrollToLandingPage = () => {
    const landingEl = document.getElementById('main-landing-content');
    if (landingEl) {
      landingEl.scrollIntoView({ behavior: 'smooth' });
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({
        top: scrollTop + rect.bottom,
        behavior: 'smooth',
      });
    }
  };

  // Find active milestone based on currentTime
  const activeMilestone =
    MILESTONES.find(
      (m) => currentTime >= m.timeStart && currentTime < m.timeEnd
    ) || MILESTONES[MILESTONES.length - 1];

  // Video assets configuration
  const videoSrc = effectiveIsMobile
    ? '/videos/commercial_mobile.mp4'
    : '/videos/commercial_desktop.mp4';
  const videoMovSrc = effectiveIsMobile
    ? '/videos/commercial_mobile.mov'
    : '/videos/commercial_desktop.mov';
  const posterSrc = effectiveIsMobile
    ? '/images/commercial/thumb_mobile.png'
    : '/images/commercial/thumb_desktop.png';

  return (
    <section
      id="intro-scroll-video"
      ref={containerRef}
      className="relative w-full h-[380vh] bg-[#07080A] text-white"
    >
      {/* Sticky Fullscreen Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#07080A]">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-radial from-[#00BCD4]/15 via-[#07080A]/85 to-[#07080A] pointer-events-none z-0" />

        {/* Video Frame Display */}
        <div
          className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ${
            effectiveIsMobile
              ? 'max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 py-8'
              : 'w-full h-full p-0'
          }`}
        >
          <div
            className={`relative overflow-hidden w-full h-full flex items-center justify-center transition-all duration-500 ${
              effectiveIsMobile
                ? 'rounded-3xl shadow-[0_0_60px_rgba(0,188,212,0.3)] border border-white/15 aspect-[9/16] max-h-[86vh] my-auto'
                : 'rounded-none'
            }`}
          >
            {/* The Responsive Video Element */}
            <video
              key={videoSrc}
              ref={videoRef}
              playsInline
              muted={isMuted}
              poster={posterSrc}
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-85'
              }`}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoMovSrc} type="video/quicktime" />
              Your browser does not support high-definition video playback.
            </video>

            {/* Subtle Gradient Overlays for High-Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 pointer-events-none" />
          </div>
        </div>

        {/* ===================== TOP HUD BAR ===================== */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-8 right-4 sm:right-8 z-30 flex items-center justify-between pointer-events-auto">
          {/* Left: Branding & Status Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BCD4] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BCD4]" />
              </span>
              <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white">
                COMMERCIAL FILM
              </span>
            </div>

            <div className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 items-center gap-1.5 text-gray-300">
              <Film className="w-3.5 h-3.5 text-[#00BCD4]" />
              <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
                SCROLL TO PLAY
              </span>
            </div>
          </div>

          {/* Right: Controls & Viewport Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Viewport Mode Switcher */}
            <div className="flex items-center bg-black/70 backdrop-blur-md border border-white/15 rounded-full p-0.5 shadow-lg">
              <button
                onClick={() => setDeviceOverride('desktop')}
                title="Desktop View (1446x1080 Landscape)"
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !effectiveIsMobile
                    ? 'bg-[#00BCD4] text-[#0A0B0D] shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden md:inline">Desktop View</span>
              </button>
              <button
                onClick={() => setDeviceOverride('mobile')}
                title="Mobile View (1080x1696 Portrait)"
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  effectiveIsMobile
                    ? 'bg-[#00BCD4] text-[#0A0B0D] shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden md:inline">Mobile View</span>
              </button>
            </div>

            {/* Sound Mute / Unmute Button */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 hover:border-[#00BCD4]/50 text-white transition-all shadow-lg cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00BCD4] animate-pulse" />
              )}
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Video'}
              className="p-2 sm:p-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-bold transition-all shadow-[0_2px_15px_rgba(0,188,212,0.4)] cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Fullscreen"
              className="hidden lg:inline-flex p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white transition-all shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
            </button>

            {/* Direct Skip to Landing Page Button */}
            <button
              onClick={scrollToLandingPage}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
            >
              <span>ENTER SITE</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-[#00BCD4]" />
            </button>
          </div>
        </div>

        {/* ===================== EDITORIAL STORY OVERLAY CARD ===================== */}
        <div className={`absolute inset-x-3 sm:inset-x-8 z-20 pointer-events-none flex flex-col justify-center max-w-7xl mx-auto ${
          effectiveIsMobile ? 'bottom-24 sm:bottom-28 top-auto' : 'top-32 sm:top-36 bottom-28 sm:bottom-32'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`pointer-events-auto ${effectiveIsMobile ? 'max-w-md mx-auto w-full' : 'max-w-xl md:max-w-2xl'}`}
            >
              <div className={`rounded-2xl sm:rounded-3xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden ${
                effectiveIsMobile ? 'p-4 sm:p-6' : 'p-6 sm:p-8 md:p-10'
              }`}>
                {/* Glowing cyan accent highlight */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00BCD4] via-[#00ACC1] to-transparent" />

                {/* Badge & Chapter */}
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3.5">
                  <span className="font-mono text-[10px] sm:text-xs text-[#00BCD4] uppercase tracking-[0.25em] font-bold">
                    {activeMilestone.chapter}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-300 font-semibold">
                    {activeMilestone.badge}
                  </span>
                </div>

                {/* Big Title */}
                <h3 className={`font-display font-black text-white tracking-tight uppercase leading-[1.1] mb-2 sm:mb-3 ${
                  effectiveIsMobile ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
                }`}>
                  {activeMilestone.title}
                </h3>

                {/* Subtitle description */}
                <p className={`text-gray-300 leading-relaxed max-w-xl ${
                  effectiveIsMobile ? 'text-[11px] sm:text-xs line-clamp-2 sm:line-clamp-none' : 'text-xs sm:text-sm md:text-base'
                }`}>
                  {activeMilestone.subtitle}
                </p>

                {/* Feature highlight pills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
                  {activeMilestone.highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/30 text-[9px] sm:text-xs font-mono text-[#38E1FF] font-medium"
                    >
                      <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#00BCD4]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===================== BOTTOM TIMELINE & CHAPTER HUD ===================== */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-30 max-w-5xl mx-auto w-full pointer-events-auto">
          <div className="p-3 sm:p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
            {/* Header / Chapter Jump Pills */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
                {MILESTONES.map((m) => {
                  const isActive =
                    currentTime >= m.timeStart && currentTime < m.timeEnd;
                  return (
                    <button
                      key={m.id}
                      onClick={() => jumpToChapter(m.timeStart)}
                      className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#00BCD4] text-[#0A0B0D] shadow-sm'
                          : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>0{m.id}</span>
                      <span className="hidden sm:inline">
                        {m.badge.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time & Percentage Readout */}
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold text-gray-300 shrink-0">
                <span className="text-[#00BCD4]">
                  00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)}s
                </span>
                <span className="text-gray-500">/</span>
                <span>00:10s</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] hidden sm:inline">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
            </div>

            {/* Interactive Timeline Scrub Bar */}
            <div
              className="relative w-full h-2.5 sm:h-3 rounded-full bg-white/10 cursor-pointer overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickProgress = Math.min(
                  Math.max((e.clientX - rect.left) / rect.width, 0),
                  1
                );
                jumpToChapter(clickProgress * duration);
              }}
            >
              {/* Active Progress Gradient Fill */}
              <div
                className="h-full bg-gradient-to-r from-[#00BCD4] via-[#38E1FF] to-[#00E5FF] transition-all duration-75 relative rounded-full shadow-[0_0_12px_rgba(0,188,212,0.8)]"
                style={{ width: `${Math.min(Math.max(scrollProgress * 100, 0), 100)}%` }}
              />

              {/* Milestone Markers */}
              {MILESTONES.map((m, idx) => {
                const markerPos = (m.timeStart / duration) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-[2px] bg-black/40 pointer-events-none"
                    style={{ left: `${markerPos}%` }}
                  />
                );
              })}
            </div>

            {/* Bottom Scroll Prompt Hint & Skip to Landing Page */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mt-2 px-1">
              <div className="flex items-center gap-1.5 text-gray-300">
                <ChevronDown className="w-3 h-3 text-[#00BCD4] animate-bounce" />
                <span className="uppercase tracking-wider">
                  Scroll down to scrub video • Scroll past to enter site
                </span>
              </div>

              <button
                onClick={scrollToLandingPage}
                className="sm:hidden text-[#00BCD4] uppercase font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Enter Site</span>
                <ArrowDownRight className="w-3 h-3" />
              </button>

              <span className="hidden sm:inline text-gray-500 uppercase tracking-widest">
                FACE PRINTING SERVICES • STATE OF QATAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
