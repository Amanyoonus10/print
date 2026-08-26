import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  tag,
  title,
  subtitle,
  align = 'left',
  className = ''
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'} ${className}`}>
      {/* Top Eyebrow Number & Tag */}
      {(number || tag) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          {number && (
            <span className="font-mono text-xs font-bold text-[#7A1F2B] px-2.5 py-1 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/25">
              {number}
            </span>
          )}
          {tag && (
            <span className="font-mono text-xs text-[#B8955A] uppercase tracking-[0.25em] font-bold">
              {tag}
            </span>
          )}
        </motion.div>
      )}

      {/* Main Massive Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#171717] tracking-tight uppercase leading-[1.05]"
      >
        {title}
      </motion.h2>

      {/* Subtitle / Narrative statement */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg md:text-xl text-[#555555] font-medium max-w-3xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
