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
    sm: 'w-9 h-9',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
    xl: 'w-22 h-22'
  };

  const textSizes = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-2xl tracking-[0.28em]',
    lg: 'text-3xl tracking-[0.32em]',
    xl: 'text-5xl tracking-[0.35em]'
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.28em]',
    md: 'text-[10px] tracking-[0.32em]',
    lg: 'text-[12px] tracking-[0.35em]',
    xl: 'text-[16px] tracking-[0.4em]'
  };

  return (
    <Link to="/" className={`group inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Official Brand Monogram Icon from PDF */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-500 group-hover:scale-105`}>
        <img
          src="/logo-icon.png"
          alt="FACE PRINTING SERVICES Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography matching Royal Maroon and Gold branding */}
      <div className="flex flex-col">
        <span className={`font-display font-black text-[#7A1F2B] leading-none ${textSizes[size]} transition-colors group-hover:text-[#631621]`}>
          FACE
        </span>
        {showSubtitle && (
          <span className={`font-mono text-[#B8955A] font-semibold uppercase mt-1 leading-none ${subtitleSizes[size]} transition-colors`}>
            PRINTING SERVICES
          </span>
        )}
      </div>
    </Link>
  );
};
