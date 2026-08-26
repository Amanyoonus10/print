import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { LogoWall } from '../components/ui/LogoWall';
import { ArrowUpRight } from 'lucide-react';

interface ClientsPageProps {
  onOpenQuoteModal: () => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ onOpenQuoteModal }) => {
  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 border-b border-gray-200">
        <SectionHeading
          number="13"
          tag="AUTHENTIC CLIENTS & PARTNERS"
          title="TRUSTED BY INDUSTRY LEADERS."
          subtitle="Proudly delivering full-service printing, branding, events, and merchandise for 26+ premier institutions across Qatar."
        />
      </section>

      {/* Clean Dual-Row Marquee */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LogoWall />
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFC] border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 uppercase">
              Partner With FACE PRINTING SERVICES
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Join Qatar’s leading corporate brands, educational institutions, and luxury hotels.
            </p>
          </div>

          <button
            onClick={onOpenQuoteModal}
            className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(0,188,212,0.35)] shrink-0 cursor-pointer"
          >
            <span>Start Your Partnership</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
