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
    <Link to="/" className={`group inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Brand Icon (Geometric Triangle + Monogram matching PDF) */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-500 group-hover:scale-105`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,188,212,0.2)]">
          {/* Top Left Cyan Triangle */}
          <path d="M15 50 L50 15 L50 50 Z" fill="#00BCD4" />
          {/* Top Right Cyan Triangle */}
          <path d="M50 50 L85 15 L85 50 Z" fill="#00BCD4" />
          {/* Bottom Center Grey Triangle */}
          <path d="M32.5 67.5 L50 50 L67.5 67.5 Z" fill="#94A3B8" />
          {/* Circular Monogram Container */}
          <circle cx="50" cy="73" r="14" stroke="#00BCD4" strokeWidth="2.5" fill="#FFFFFF" />
          {/* Stylized 'face' glyph inside circle */}
          <path d="M44 73 C44 70 47 70 50 70 C53 70 56 70 56 73 C56 76 53 76 50 76 C47 76 44 76 44 73 Z" stroke="#00BCD4" strokeWidth="1.8" fill="none" />
          <line x1="42" y1="73" x2="58" y2="73" stroke="#00BCD4" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-display font-extrabold text-[#0A0B0D] leading-none ${textSizes[size]} transition-colors group-hover:text-[#00BCD4]`}>
          FACE
        </span>
        {showSubtitle && (
          <span className={`font-mono text-[#64748B] font-medium uppercase mt-1 leading-none ${subtitleSizes[size]} transition-colors group-hover:text-[#00BCD4]`}>
            PRINTING SERVICES
          </span>
        )}
      </div>
    </Link>
  );
};
