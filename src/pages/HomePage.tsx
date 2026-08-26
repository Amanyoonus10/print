import React, { useState, useEffect } from 'react';
import { ScrollVideo } from '../components/home/ScrollVideo';
import { Hero } from '../components/home/Hero';
import { Introduction } from '../components/home/Introduction';
import { InteractiveServices } from '../components/home/InteractiveServices';
import { FeaturedWork } from '../components/home/FeaturedWork';
import { LogoWall } from '../components/ui/LogoWall';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

interface HomePageProps {
  onOpenQuoteModal: () => void;
}

// In-memory flag: resets on browser refresh, but persists during in-app navigation & back swipe
let hasCompletedIntroThisSession = false;

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  // Always start from beginning on fresh page load or refresh; skip on back swipe from sub-pages
  const [showIntro, setShowIntro] = useState<boolean>(!hasCompletedIntroThisSession);

  const handleIntroComplete = () => {
    setShowIntro(false);
    hasCompletedIntroThisSession = true;
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Restore scroll position when returning from sub-pages / back swipe
  useEffect(() => {
    if (!showIntro) {
      const savedPos = sessionStorage.getItem('face_home_scroll');
      if (savedPos) {
        const scrollY = parseInt(savedPos, 10);
        if (!isNaN(scrollY) && scrollY > 0) {
          const timer = setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' });
          }, 50);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [showIntro]);

  // Save scroll position when leaving homepage (debounced)
  useEffect(() => {
    let timeoutId: number;
    const handleSaveScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (window.scrollY > 0) {
          sessionStorage.setItem('face_home_scroll', window.scrollY.toString());
        }
      }, 150);
    };

    window.addEventListener('scroll', handleSaveScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleSaveScroll);
    };
  }, []);

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF]">
      {/* 00 ENTRY CINEMATIC SCROLL VIDEO: 60fps scrubbable entry film with instant skip */}
      {showIntro && <ScrollVideo onComplete={handleIntroComplete} />}

      {/* 01 HERO */}
      <Hero onOpenQuoteModal={onOpenQuoteModal} onReplayIntro={handleReplayIntro} />

      {/* 02 COMPANY STORY / INTRODUCTION */}
      <Introduction />

      {/* 03 INTERACTIVE SERVICES LIST */}
      <InteractiveServices />

      {/* 04 FEATURED WORK */}
      <FeaturedWork onOpenQuoteModal={onOpenQuoteModal} />


      {/* 13 OUR CLIENTS */}
      <section id="clients" className="py-28 md:py-36 bg-[#F8FAFC] border-b border-gray-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading
              number="13"
              tag="TRUSTED IN QATAR"
              title="OUR CLIENTS & PARTNERS."
              subtitle="Proudly supporting government entities, global corporations, educational academies, and luxury hospitality."
            />
          </div>
        </div>

        {/* Clean Infinite Client Logo Marquee */}
        <LogoWall />
      </section>

      {/* 14 FINAL CTA / CONTACT */}
      <section id="contact" className="py-24 md:py-32 bg-[#F7F4EE] relative overflow-hidden border-b border-[#EDE8DE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-16 md:p-20 rounded-3xl bg-white border border-[#EDE8DE] relative overflow-hidden shadow-xl">
            {/* Top Gold Glow Line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-transparent via-[#B8955A] to-transparent" />

            <span className="font-mono text-xs text-[#B8955A] uppercase tracking-[0.3em] font-bold block mb-4">
              State of Qatar • Turnkey Production
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#171717] tracking-tight uppercase leading-[1.08] max-w-4xl mx-auto">
              HIGH-IMPACT PRINT & BRANDING SOLUTIONS.
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
              Partner with FACE PRINTING SERVICES to bring your physical branding, vehicle wrapping, retail displays, and executive gifts to life with unmatched precision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <button
                onClick={onOpenQuoteModal}
                className="px-8 py-4 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_25px_rgba(122,31,43,0.35)] cursor-pointer group hover:scale-105"
              >
                <span>Request Project Quotation</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="https://wa.me/97433635098"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs transition-all duration-300 flex items-center gap-2 border border-[#25D366]/30 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+974 3363 5098)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
