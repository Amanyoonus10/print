import React from 'react';
import { clientsData } from '../../data/clients';

interface LogoWallProps {
  variant?: 'marquee' | 'grid' | 'both';
  limit?: number;
  showFilters?: boolean;
}

export const LogoWall: React.FC<LogoWallProps> = () => {
  // Split clients into two rows for dual-direction smooth marquee
  const mid = Math.ceil(clientsData.length / 2);
  const row1 = clientsData.slice(0, mid);
  const row2 = clientsData.slice(mid);

  const row1Marquee = [...row1, ...row1];
  const row2Marquee = [...row2, ...row2];

  return (
    <div className="w-full flex flex-col gap-5 relative overflow-hidden py-4">
      {/* Left / Right gradient fade masks for smooth infinity look */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#F7F4EE] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#F7F4EE] to-transparent z-10 pointer-events-none" />

      {/* Row 1: Leftward scrolling marquee */}
      <div className="animate-marquee flex items-center gap-4">
        {row1Marquee.map((client, idx) => (
          <div
            key={`r1-${client.id}-${idx}`}
            className="flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white border border-[#EDE8DE] shrink-0 shadow-xs hover:border-[#B8955A]/60 hover:shadow-md transition-all duration-300 group cursor-default"
          >
            <div className="w-16 h-10 rounded-xl bg-[#F7F4EE] p-1.5 flex items-center justify-center overflow-hidden shrink-0 border border-[#EDE8DE]">
              <img
                src={`/images/clients/${client.id}.png`}
                alt={client.name}
                className="max-w-full max-h-full object-contain filter contrast-[1.05]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wide text-[#171717] group-hover:text-[#7A1F2B] transition-colors whitespace-nowrap">
                {client.name}
              </span>
              <span className="font-mono text-[10px] text-[#B8955A] font-semibold uppercase tracking-wider">
                {client.sector}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Rightward reverse scrolling marquee */}
      <div className="animate-marquee-reverse flex items-center gap-4">
        {row2Marquee.map((client, idx) => (
          <div
            key={`r2-${client.id}-${idx}`}
            className="flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white border border-[#EDE8DE] shrink-0 shadow-xs hover:border-[#B8955A]/60 hover:shadow-md transition-all duration-300 group cursor-default"
          >
            <div className="w-16 h-10 rounded-xl bg-[#F7F4EE] p-1.5 flex items-center justify-center overflow-hidden shrink-0 border border-[#EDE8DE]">
              <img
                src={`/images/clients/${client.id}.png`}
                alt={client.name}
                className="max-w-full max-h-full object-contain filter contrast-[1.05]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wide text-[#171717] group-hover:text-[#7A1F2B] transition-colors whitespace-nowrap">
                {client.name}
              </span>
              <span className="font-mono text-[10px] text-[#B8955A] font-semibold uppercase tracking-wider">
                {client.sector}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
