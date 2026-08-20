import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { servicesData } from '../../data/services';

export const ServiceShowcases: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-[#FFFFFF]">
      {servicesData.map((service, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`relative py-24 md:py-32 border-b border-gray-200 overflow-hidden ${
              isEven ? 'bg-[#FFFFFF]' : 'bg-[#F8FAFC]'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-1/2 ${isEven ? 'left-0' : 'right-0'} -translate-y-1/2 w-96 h-96 bg-[#00BCD4]/5 rounded-full blur-3xl pointer-events-none`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 flex flex-col gap-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  {/* Number & Category Pill */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#008BA3] px-3 py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25">
                      {service.number}
                    </span>
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">
                      Specialized Production
                    </span>
                  </div>

                  {/* Oversized Title */}
                  <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#0A0B0D] tracking-tight uppercase leading-[1.05]">
                    {service.title}
                  </h2>

                  {/* Subtitle / Statement */}
                  <p className="text-lg md:text-xl font-medium text-[#008BA3] leading-snug">
                    “{service.subtitle}”
                  </p>

                  {/* Full Description */}
                  <p className="text-base text-gray-600 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {service.features.slice(0, 4).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                        <span className="text-xs font-mono text-gray-800 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deep Dive Action Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Link
                      to={`/services/${service.slug}`}
                      className="px-6 py-3.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.3)] group"
                    >
                      <span>Explore {service.title} Hub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    <Link
                      to="/contact"
                      className="px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-xs uppercase tracking-wider border border-gray-200 transition-all font-medium"
                    >
                      Inquire Specs
                    </Link>
                  </div>
                </motion.div>

                {/* Visual Imagery Side */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 flex flex-col gap-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  {/* Primary Large Image */}
                  <div className="relative rounded-3xl overflow-hidden aspect-[16/11] bg-gray-100 border border-gray-200 group shadow-lg">
                    <img
                      src={service.heroImage}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-[#38E1FF] uppercase tracking-widest block font-bold">
                          Production Standard
                        </span>
                        <span className="font-display font-bold text-lg text-white">
                          {service.materials[0] || 'Precision Grade Materials'}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {service.gallery.length} Exhibits
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Supporting Detail Images */}
                  <div className="grid grid-cols-2 gap-4">
                    {service.gallery.slice(0, 2).map((item, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 group shadow-xs"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <p className="text-[11px] font-display font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] font-mono text-gray-300 truncate">
                            {item.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
