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
    primary: "bg-[#7A1F2B] text-white hover:bg-[#631621] hover:shadow-[0_4px_20px_rgba(122,31,43,0.35)] active:scale-[0.98]",
    secondary: "bg-[#EDE8DE] text-[#171717] hover:bg-white hover:border-[#EDE8DE] border border-[#EDE8DE] active:scale-[0.98]",
    outline: "bg-transparent text-[#171717] border border-[#EDE8DE] hover:border-[#7A1F2B] hover:text-[#7A1F2B] hover:bg-[#7A1F2B]/5 active:scale-[0.98]",
    ghost: "bg-transparent text-[#555555] hover:text-[#171717] hover:bg-[#EDE8DE]/50 active:scale-[0.98]"
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
