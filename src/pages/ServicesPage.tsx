import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface ServicesPageProps {
  onOpenQuoteModal: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenQuoteModal }) => {
  const { services } = useContent();

  return (
    <div className="w-full pt-32 pb-24 bg-[#F7F4EE] overflow-hidden">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 border-b border-[#EDE8DE]">
        <SectionHeading
          number="02"
          tag="SERVICES DIRECTORY"
          title={`${services.length} PRODUCTION DISCIPLINES.`}
          subtitle="Precision printing, large-format staging, illuminated systems, and bespoke corporate merchandise in Doha."
        />
      </section>

      {/* Services Grid with Rich Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service) => (
            <div
              key={service.slug}
              className="group rounded-3xl bg-white border border-[#EDE8DE] overflow-hidden hover:border-[#B8955A]/60 transition-all duration-400 flex flex-col justify-between shadow-xs hover:shadow-xl"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    {service.number}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 flex flex-col gap-5 flex-grow justify-between">
                <div>
                  <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-[#EDE8DE]">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#555555] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B8955A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-[#EDE8DE] flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#7A1F2B] hover:text-[#B8955A] uppercase tracking-wider group"
                  >
                    <span>View Specifications & Gallery</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <button
                    onClick={onOpenQuoteModal}
                    className="px-4 py-2 rounded-full bg-[#EDE8DE] hover:bg-[#7A1F2B] text-[#171717] hover:text-white border border-[#EDE8DE] font-mono text-xs uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
