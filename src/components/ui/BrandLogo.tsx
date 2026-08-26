import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-xl tracking-[0.28em]',
    lg: 'text-2xl tracking-[0.32em]',
    xl: 'text-4xl tracking-[0.35em]'
  };

  const subtitleSizes = {
    sm: 'text-[7px] tracking-[0.28em]',
    md: 'text-[9px] tracking-[0.32em]',
    lg: 'text-[11px] tracking-[0.35em]',
    xl: 'text-[14px] tracking-[0.4em]'
  };

  return (
    <Link to="/" className={`group inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Monogram Icon from PDF */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-500 group-hover:scale-105`}>
        <img
          src="/logo-icon.png"
          alt="FACE PRINTING SERVICES Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography matching PDF branding */}
      <div className="flex flex-col">
        <span className={`font-display font-black text-[#00BCD4] leading-none ${textSizes[size]} transition-colors group-hover:text-[#008BA3]`}>
          FACE
        </span>
        {showSubtitle && (
          <span className={`font-mono text-[#008BA3] font-semibold uppercase mt-1 leading-none ${subtitleSizes[size]} transition-colors`}>
            PRINTING SERVICES
          </span>
        )}
      </div>
    </Link>
  );
};
