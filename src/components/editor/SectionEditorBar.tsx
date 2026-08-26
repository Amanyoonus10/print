import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface SectionEditorBarProps {
  sectionName: string;
  onAddImage?: () => void;
  onEditText?: () => void;
  addImageLabel?: string;
  editTextLabel?: string;
  customActions?: React.ReactNode;
}

export const SectionEditorBar: React.FC<SectionEditorBarProps> = ({
  sectionName,
  onAddImage,
  onEditText,
  addImageLabel = 'Add Image',
  editTextLabel = 'Edit Description',
  customActions,
}) => {
  const { isEditMode } = useContent();

  if (!isEditMode) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/15 text-white shadow-xl">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BCD4] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BCD4]" />
        </span>
        <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
          {sectionName}
        </span>
        <span className="hidden sm:inline-block font-mono text-[10px] text-[#38E1FF] bg-[#00BCD4]/15 px-2 py-0.5 rounded-full border border-[#00BCD4]/30">
          Section Controls
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onAddImage && (
          <button
            onClick={onAddImage}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_2px_10px_rgba(0,188,212,0.4)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addImageLabel}</span>
          </button>
        )}

        {onEditText && (
          <button
            onClick={onEditText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all border border-white/15 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#38E1FF]" />
            <span>{editTextLabel}</span>
          </button>
        )}

        {customActions}
      </div>
    </div>
  );
};

export const RemoveImageButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  className?: string;
}> = ({ onClick, label = 'Remove', className = '' }) => {
  const { isEditMode } = useContent();

  if (!isEditMode) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      title="Remove item"
      className={`z-30 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider shadow-lg backdrop-blur-md transition-all cursor-pointer border border-white/20 ${className}`}
    >
      <Trash2 className="w-3 h-3" />
      <span>{label}</span>
    </button>
  );
};
