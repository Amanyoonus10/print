import React from 'react';
import { PlusCircle, Trash2, Edit3 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface SectionEditorBarProps {
  sectionName?: string;
  onAddImage?: () => void;
  onEditText?: () => void;
  onClearData?: () => void;
  addImageLabel?: string;
  editTextLabel?: string;
  clearDataLabel?: string;
  customActions?: React.ReactNode;
  className?: string;
}

export const SectionEditorBar: React.FC<SectionEditorBarProps> = ({
  onAddImage,
  onEditText,
  onClearData,
  addImageLabel = 'Add Gallery Item',
  editTextLabel = 'Edit Text',
  clearDataLabel = 'Clear Added Data',
  customActions,
  className = '',
}) => {
  const { resetToDefaults } = useContent();

  const handleClear = () => {
    if (onClearData) {
      onClearData();
    } else {
      resetToDefaults();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {onAddImage && (
        <button
          onClick={onAddImage}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 font-mono text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer group active:scale-98"
        >
          <PlusCircle className="w-3.5 h-3.5 text-gray-700 stroke-[2] transition-transform group-hover:rotate-90 duration-300" />
          <span>{addImageLabel}</span>
        </button>
      )}

      {onClearData && (
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 font-mono text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
        >
          <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
          <span>{clearDataLabel}</span>
        </button>
      )}

      {onEditText && (
        <button
          onClick={onEditText}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-mono text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-gray-500" />
          <span>{editTextLabel}</span>
        </button>
      )}

      {customActions}
    </div>
  );
};

export const RemoveImageButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      title="Delete item"
      className={`z-30 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-red-600 text-gray-700 hover:text-white border border-gray-200 shadow-md backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
    >
      <Trash2 className="w-4 h-4 stroke-[2]" />
    </button>
  );
};

