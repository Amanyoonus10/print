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
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#008BA3] px-3 py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25">
                {project.category}
              </span>
              <span className="font-mono text-xs text-gray-500">Year {project.year}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Title & Description */}
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-gray-900 uppercase tracking-tight">
                {project.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mt-3 leading-relaxed">
                {project.description || project.summary}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono">
              <div>
                <span className="text-gray-400 uppercase flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#00BCD4]" /> Client
                </span>
                <span className="font-bold text-gray-900 block mt-0.5">{project.client}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#00BCD4]" /> Discipline
                </span>
                <span className="font-bold text-gray-900 block mt-0.5">{project.category}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#00BCD4]" /> Year
                </span>
                <span className="font-bold text-gray-900 block mt-0.5">{project.year}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase block">Location</span>
                <span className="font-bold text-gray-900 block mt-0.5">Doha, Qatar</span>
              </div>
            </div>

            {/* Main Cover Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 border border-gray-200 shadow-md">
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
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                    <span className="font-mono text-xs text-[#008BA3] uppercase font-bold block mb-1">
                      The Challenge
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                    <span className="font-mono text-xs text-[#008BA3] uppercase font-bold block mb-1">
                      Our Solution
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Project Gallery Photos */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h4 className="font-display font-bold text-lg text-gray-900 mb-4">
                  Case Study Photo Gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((g, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shadow-xs"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={g.url}
                          alt={g.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-display font-semibold text-xs text-gray-900">{g.title}</p>
                        {g.caption && <p className="font-mono text-[10px] text-gray-500 mt-0.5">{g.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA in Modal */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold text-gray-600 hover:bg-gray-100"
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
                  className="px-6 py-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
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
