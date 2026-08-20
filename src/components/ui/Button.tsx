import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon = false,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-display font-semibold transition-all duration-300 rounded-full select-none cursor-pointer tracking-wider text-xs uppercase";

  const sizeStyles = {
    sm: "px-4 py-2 text-[11px] gap-1.5",
    md: "px-6 py-3 text-xs gap-2",
    lg: "px-8 py-4 text-sm gap-2.5"
  };

  const variantStyles = {
    primary: "bg-[#00BCD4] text-[#0A0B0D] hover:bg-[#38E1FF] hover:shadow-[0_0_25px_rgba(0,188,212,0.4)] active:scale-[0.98]",
    secondary: "bg-white/10 text-white backdrop-blur-md border border-white/15 hover:bg-white/20 hover:border-white/30 active:scale-[0.98]",
    outline: "bg-transparent text-white border border-white/20 hover:border-[#00BCD4] hover:text-[#00BCD4] hover:bg-[#00BCD4]/5 active:scale-[0.98]",
    ghost: "bg-transparent text-[#94A3B8] hover:text-white hover:bg-white/5 active:scale-[0.98]"
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`group ${combinedClasses}`}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`group ${combinedClasses}`}>
      {content}
    </button>
  );
};
