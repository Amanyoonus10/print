import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clientsData } from '../../data/clients';

interface LogoWallProps {
  variant?: 'marquee' | 'grid' | 'both';
  limit?: number;
  showFilters?: boolean;
}

export const LogoWall: React.FC<LogoWallProps> = ({
  variant = 'both',
  limit,
  showFilters = false
}) => {
  const [activeSector, setActiveSector] = useState<string>('All');

  const sectors = ['All', 'Aviation & Transport', 'Banking & Finance', 'Education & Science', 'Hospitality & Luxury', 'Retail & Commercial', 'Sports & Events'];

  const filteredClients = activeSector === 'All'
    ? clientsData
    : clientsData.filter(c => c.sector === activeSector);

  const displayClients = limit ? filteredClients.slice(0, limit) : filteredClients;

  // Duplicate for seamless infinite marquee
  const marqueeItems = [...clientsData, ...clientsData];

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Infinite Scrolling Marquee */}
      {(variant === 'marquee' || variant === 'both') && (
        <div className="relative w-full overflow-hidden py-6 border-y border-gray-200 bg-gray-50/70">
          {/* Left / Right gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-6">
            {marqueeItems.map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                className="flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-white border border-gray-200 shrink-0 hover:border-[#00BCD4]/50 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="w-14 h-9 rounded-lg bg-gray-50 p-1 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105 border border-gray-100">
                  <img
                    src={`/images/clients/${client.id}.png`}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-wide text-gray-900 group-hover:text-[#008BA3] transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                    {client.sector}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Filterable Grid */}
      {(variant === 'grid' || variant === 'both') && (
        <div className="w-full flex flex-col gap-8">
          {showFilters && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              {sectors.map(sector => (
                <button
                  key={sector}
                  onClick={() => setActiveSector(sector)}
                  className={`font-mono text-xs px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSector === sector
                      ? 'bg-[#00BCD4] text-[#0A0B0D] font-bold shadow-[0_2px_15px_rgba(0,188,212,0.3)]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black border border-gray-200'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          )}

          {/* Grid Cards with Authentic Cropped Logos */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
          >
            <AnimatePresence>
              {displayClients.map(client => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={client.id}
                  className="group relative p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#00BCD4]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                >
                  {/* Top Authentic Logo Banner */}
                  <div className="w-full h-16 rounded-xl bg-gray-50 p-2 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:bg-white transition-all">
                    <img
                      src={`/images/clients/${client.id}.png`}
                      alt={client.name}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain filter contrast-[1.05]"
                    />
                  </div>

                  <div className="mt-3">
                    <h4 className="font-display font-bold text-xs text-gray-900 leading-tight group-hover:text-[#008BA3] transition-colors truncate">
                      {client.name}
                    </h4>
                    <p className="mt-0.5 font-mono text-[9px] text-gray-500 truncate">
                      {client.sector}
                    </p>
                  </div>

                  {/* Highlighted Work */}
                  {client.highlightWork && (
                    <div className="mt-2 pt-1.5 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-[9px] font-mono text-[#008BA3] line-clamp-1 leading-tight font-medium">
                        {client.highlightWork}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};
