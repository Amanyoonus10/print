import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Calendar, Building2, Tag } from 'lucide-react';
import type { ProjectItem } from '../../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DE] bg-[#F7F4EE] sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#7A1F2B] px-3 py-1 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/25">
                {project.category}
              </span>
              <span className="font-mono text-xs text-[#B8955A] font-bold">Year {project.year}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EDE8DE] text-gray-400 hover:text-[#171717] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 bg-white">
            {/* Title & Description */}
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#171717] uppercase tracking-tight">
                {project.title}
              </h2>
              <p className="text-base sm:text-lg text-[#555555] mt-3 leading-relaxed">
                {project.description || project.summary}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F7F4EE] border border-[#EDE8DE] text-xs font-mono">
              <div>
                <span className="text-[#B8955A] uppercase flex items-center gap-1 font-bold">
                  <Building2 className="w-3.5 h-3.5 text-[#7A1F2B]" /> Client
                </span>
                <span className="font-bold text-[#171717] block mt-0.5">{project.client}</span>
              </div>
              <div>
                <span className="text-[#B8955A] uppercase flex items-center gap-1 font-bold">
                  <Tag className="w-3.5 h-3.5 text-[#7A1F2B]" /> Discipline
                </span>
                <span className="font-bold text-[#171717] block mt-0.5">{project.category}</span>
              </div>
              <div>
                <span className="text-[#B8955A] uppercase flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-[#7A1F2B]" /> Year
                </span>
                <span className="font-bold text-[#171717] block mt-0.5">{project.year}</span>
              </div>
              <div>
                <span className="text-[#B8955A] uppercase block font-bold">Location</span>
                <span className="font-bold text-[#171717] block mt-0.5">Doha, Qatar</span>
              </div>
            </div>

            {/* Main Cover Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#F7F4EE] border border-[#EDE8DE] shadow-md">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Challenge & Solution (if available) */}
            {(project.challenge || project.solution) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.challenge && (
                  <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#EDE8DE]">
                    <span className="font-mono text-xs text-[#7A1F2B] uppercase font-bold block mb-1">
                      The Challenge
                    </span>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-[#EDE8DE]">
                    <span className="font-mono text-xs text-[#7A1F2B] uppercase font-bold block mb-1">
                      Our Solution
                    </span>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Project Gallery Photos */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h4 className="font-display font-bold text-lg text-[#171717] mb-4">
                  Case Study Photo Gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((g, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden bg-white border border-[#EDE8DE] shadow-xs"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#F7F4EE]">
                        <img
                          src={g.url}
                          alt={g.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-display font-semibold text-xs text-[#171717]">{g.title}</p>
                        {g.caption && <p className="font-mono text-[10px] text-[#777777] mt-0.5">{g.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA in Modal */}
            <div className="pt-4 border-t border-[#EDE8DE] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold text-gray-600 hover:bg-[#EDE8DE] cursor-pointer"
              >
                Close
              </button>
              {onOpenQuoteModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenQuoteModal();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer hover:scale-102 transition-all"
                >
                  <span>Inquire Similar Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
