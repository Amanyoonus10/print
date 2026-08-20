import React, { useRef, useEffect } from 'react';
import { ArrowDown, ShieldCheck, Cpu } from 'lucide-react';
import { companyData } from '../../data/company';

interface HeroProps {
  onOpenQuoteModal?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const scrollToExplore = () => {
    const nextSection = document.getElementById('introduction');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-20 sm:pt-22 pb-4 bg-[#FFFFFF] overflow-hidden">
      {/* Full-Width Edge-to-Edge Video Container (Strictly Zero Black Bars on Any Screen) */}
      <div className="flex-1 w-full flex items-center justify-center my-auto px-0 overflow-hidden">
        <div className="relative w-full h-[65vh] sm:h-[72vh] md:h-[76vh] max-h-[calc(100vh-150px)] overflow-hidden bg-transparent">
          <video
            ref={videoRef}
            src="/videos/hero_combined_loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', minWidth: '100%', minHeight: '100%' }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator & Core Credentials Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3 pb-1 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 mt-2">
        <button
          onClick={scrollToExplore}
          className="flex items-center gap-3 text-xs font-mono tracking-[0.25em] text-gray-700 hover:text-[#00BCD4] transition-colors cursor-pointer group uppercase font-bold"
        >
          <div className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center group-hover:border-[#00BCD4] transition-colors shadow-xs">
            <ArrowDown className="w-3 h-3 text-[#00BCD4] animate-bounce" />
          </div>
          <span>SCROLL TO EXPLORE</span>
        </button>

        {/* 3 Core Strengths Badges */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono text-gray-700 font-semibold">
          <span className="hidden md:inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#008BA3]" />
            Advanced Technology
          </span>
          <span className="hidden sm:inline-flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#008BA3]" />
            Expert Craftsmanship
          </span>
          <span className="inline-flex items-center gap-2 text-gray-900 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />
            CR: {companyData.contact.cr}
          </span>
        </div>
      </div>
    </section>
  );
};
