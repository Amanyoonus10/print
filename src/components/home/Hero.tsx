import React, { useRef, useEffect } from 'react';
import { ArrowDown, ShieldCheck, Cpu } from 'lucide-react';
import { companyData } from '../../data/company';

interface HeroProps {
  onOpenQuoteModal?: () => void;
  onReplayIntro?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReplayIntro }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
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
    <section id="hero-section" className="relative w-full min-h-[100dvh] flex flex-col justify-between pt-18 sm:pt-22 pb-2 sm:pb-4 bg-[#F7F4EE] overflow-hidden">
      {/* Responsive Video Container - Perfectly Framed on Mobile & Edge-to-Edge on Desktop */}
      <div className="flex-1 w-full flex items-center justify-center my-auto px-2 sm:px-4 lg:px-0 overflow-hidden">
        <div className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[72vh] md:h-[76vh] max-h-[calc(100dvh-140px)] rounded-2xl sm:rounded-none overflow-hidden bg-black/5 shadow-md sm:shadow-none border border-[#EDE8DE]/80 sm:border-none">
          <video
            ref={videoRef}
            poster="/videos/hero_combined_poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 1.0;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 1.0;
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero_combined_loop_mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
            <source src="/videos/hero_combined_loop.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Bottom Bar: Streamlined 1-Row Responsive Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full pt-2.5 sm:pt-3 pb-1 flex items-center justify-between border-t border-[#EDE8DE] mt-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={scrollToExplore}
            className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono tracking-[0.18em] sm:tracking-[0.25em] text-[#171717]/80 hover:text-[#49C1DA] transition-colors cursor-pointer group uppercase font-bold"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#EDE8DE] bg-white flex items-center justify-center group-hover:border-[#49C1DA] transition-colors shadow-xs shrink-0">
              <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#49C1DA] animate-bounce" />
            </div>
            <span>SCROLL TO EXPLORE</span>
          </button>

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE8DE] hover:bg-white text-[#171717]/80 hover:text-[#49C1DA] font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-[#EDE8DE]"
            >
              <span>🎬 Watch Commercial Film</span>
            </button>
          )}
        </div>

        {/* 3 Core Strengths Badges / Mobile Credentials */}
        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-mono text-[#171717]/80 font-semibold">
          <span className="hidden md:inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B8955A]" />
            Advanced Technology
          </span>
          <span className="hidden sm:inline-flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#B8955A]" />
            Expert Craftsmanship
          </span>
          <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[#171717] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#49C1DA] shrink-0" />
            CR: {companyData.contact.cr}
          </span>
        </div>
      </div>
    </section>
  );
};

