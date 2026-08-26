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

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  // Never block homepage scrolling on load; show commercial modal only on explicit button click
  const [showCommercialModal, setShowCommercialModal] = useState<boolean>(false);

  const handleOpenCommercial = () => {
    setShowCommercialModal(true);
  };

  const handleCloseCommercial = () => {
    setShowCommercialModal(false);
  };

  // Restore scroll position when returning from sub-pages / back swipe
  useEffect(() => {
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
  }, []);

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
      {/* Optional Commercial Film Lightbox Modal */}
      {showCommercialModal && (
        <ScrollVideo onComplete={handleCloseCommercial} />
      )}

      {/* 01 HERO */}
      <Hero onOpenQuoteModal={onOpenQuoteModal} onReplayIntro={handleOpenCommercial} />

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
      <section id="contact" className="py-24 md:py-32 bg-[#FFFFFF] relative overflow-hidden border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-16 md:p-20 rounded-3xl bg-[#F8FAFC] border border-gray-200 relative overflow-hidden shadow-lg">
            {/* Top Cyan Glow Line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-gradient-to-r from-transparent via-[#00BCD4] to-transparent" />

            <span className="font-mono text-xs text-[#008BA3] uppercase tracking-[0.3em] font-bold block mb-4">
              State of Qatar • Turnkey Production
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight uppercase leading-[1.08] max-w-4xl mx-auto">
              HIGH-IMPACT PRINT & BRANDING SOLUTIONS.
            </h2>

            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Partner with FACE PRINTING SERVICES to bring your physical branding, vehicle wrapping, retail displays, and executive gifts to life with unmatched precision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <button
                onClick={onOpenQuoteModal}
                className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer group"
              >
                <span>Request Project Quotation</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href="https://wa.me/97433635098"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-semibold text-xs transition-all duration-300 flex items-center gap-2 border border-[#25D366]/40"
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
