import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Download, Eye, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const EditorToolbar: React.FC = () => {
  const { isEditMode, toggleEditMode, resetToDefaults, exportContentJSON } = useContent();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="fixed bottom-6 right-6 z-[99990] select-none">
      <motion.div
        layout
        className="bg-[#0A0B0D]/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-2.5 sm:p-3 text-white flex flex-col gap-2"
      >
        {/* Header / Toggle Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md ${
              isEditMode
                ? 'bg-[#7A1F2B] text-white hover:bg-[#631621]'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {isEditMode ? (
              <>
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Mode: ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Options */}
        <AnimatePresence>
          {isExpanded && isEditMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-1.5 pt-2 border-t border-white/10"
            >
              <div className="text-[10px] font-mono text-gray-400 px-2 py-0.5">
                Section Action Buttons are visible on all page sections.
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetToDefaults}
                  title="Reset all images and descriptions to original template defaults"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-white/10"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>

                <button
                  onClick={exportContentJSON}
                  title="Download a JSON backup of your current images & text"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#B8955A]/20 text-gray-300 hover:text-[#B8955A] font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-white/10"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
