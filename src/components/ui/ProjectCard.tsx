import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '../../types';
import { RemoveImageButton } from '../editor/SectionEditorBar';

interface ProjectCardProps {
  project: ProjectItem;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  priority?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  aspectRatio = 'wide',
  priority = false,
  onRemove,
  onClick,
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/10]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-4 relative cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container with Hover Scale */}
      <div
        className={`relative w-full ${aspectClasses[aspectRatio]} rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm transition-all duration-500 group-hover:border-[#00BCD4]/50 group-hover:shadow-xl`}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

        {/* Top Badges & Remove Button */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <span className="font-mono text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
            {project.category}
          </span>
          
          <div className="flex items-center gap-2">
            {onRemove && (
              <RemoveImageButton onClick={onRemove} label="Delete" />
            )}
            <span className="font-mono text-xs text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {project.year}
            </span>
          </div>
        </div>

        {/* Bottom Card Preview on Hover */}
        <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-[#38E1FF] uppercase tracking-wider font-semibold">
              Client: {project.client}
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-snug mt-0.5 drop-shadow-sm">
              {project.title}
            </h3>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#00BCD4] text-[#0A0B0D] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md shrink-0 ml-3">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Narrative summary below card */}
      <div className="px-2">
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {project.summary}
        </p>
      </div>
    </motion.div>
  );
};


