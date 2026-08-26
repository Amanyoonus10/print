import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ScrollVideoProps {
  onComplete: () => void;
}

const TOTAL_FRAMES = 120;

export const ScrollVideo: React.FC<ScrollVideoProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafIdRef = useRef<number | null>(null);

  const [isDismissing, setIsDismissing] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Preload all frames for instant 0ms canvas painting (mobile vertical vs desktop landscape)
  useEffect(() => {
    const isMob = window.innerWidth < 768;
    const folder = isMob ? '/videos/frames_mobile' : '/videos/frames';
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `${folder}/frame_${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        // As soon as first few frames load, start rendering immediately
        if (loadedCount >= 5 && !isLoaded) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Complete and enter site
  const handleFinish = useCallback(() => {
    if (isDismissing) return;
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  }, [isDismissing, onComplete]);

  // Draw current frame to canvas with perfect object-fit cover
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Calculate aspect ratio cover dimensions
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const w = imgWidth * scale;
    const h = imgHeight * scale;
    const x = (canvasWidth - w) / 2;
    const y = (canvasHeight - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  }, []);

  // Resize canvas to match display pixel ratio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const currentFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)))
        );
        drawFrame(currentFrame);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, isLoaded]);

  // 120 FPS ultra-smooth Lerp animation loop
  useEffect(() => {
    const loop = () => {
      if (!isDismissing) {
        const targetP = targetProgressRef.current;
        const currentP = currentProgressRef.current;
        const diff = targetP - currentP;

        if (Math.abs(diff) > 0.0001) {
          // Buttery smooth responsive dampening
          const nextP = currentP + diff * 0.14;
          currentProgressRef.current = nextP;

          const frameIdx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(nextP * (TOTAL_FRAMES - 1)))
          );
          drawFrame(frameIdx);

          // If reached 97%+ progress, transition into site
          if (nextP >= 0.96 && targetP >= 0.97) {
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
  }, [isDismissing, drawFrame, handleFinish]);

  // Lock document body scroll while intro is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Wheel scrubbing handler (0 lag, continuous, silky smooth)
  const handleWheel = (e: React.WheelEvent) => {
    if (isDismissing) return;
    const delta = e.deltaY;
    const step = delta * 0.0008;
    targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + step));
  };

  // Touch scrubbing handler (Mobile - 1:1 responsive touch momentum)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDismissing) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    const step = (diff / window.innerHeight) * 0.9;
    targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + step));
  };

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.99, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#07080A] text-white flex items-center justify-center select-none overflow-hidden touch-none"
        >
          {/* Hardware-Accelerated 120fps Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            style={{ width: '100vw', height: '100vh' }}
          />

          {/* Top Skip Button */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_25px_rgba(122,31,43,0.45)] cursor-pointer hover:scale-105 border border-[#B8955A]/30"
            >
              <span>Skip to Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

