import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollVideoProps {
  onComplete: () => void;
}

export const ScrollVideo: React.FC<ScrollVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  // Complete and enter site smoothly
  const handleFinish = useCallback(() => {
    if (isDismissing) return;
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [isDismissing, onComplete]);

  // Autoplay video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  // Lock document body scroll while intro is playing
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          onClick={handleFinish}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#07080A] text-white flex items-center justify-center select-none overflow-hidden cursor-pointer"
        >
          {/* Normal Hardware-Accelerated Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleFinish}
            className="w-full h-full object-cover pointer-events-none"
          >
            <source src="/videos/commercial_mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
            <source src="/videos/commercial_desktop.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

