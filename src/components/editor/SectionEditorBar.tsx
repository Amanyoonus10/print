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
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {onAddImage && (
        <button
          onClick={onAddImage}
          title={addImageLabel}
          aria-label={addImageLabel}
          className="inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-[#49C1DA] shadow-xs transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-gray-700 group-hover:text-[#49C1DA] stroke-[2] transition-transform group-hover:rotate-90 duration-300" />
        </button>
      )}

      {onClearData && (
        <button
          onClick={handleClear}
          title={clearDataLabel}
          aria-label={clearDataLabel}
          className="inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
        >
          <Trash2 className="w-4 h-4 stroke-[2]" />
        </button>
      )}

      {onEditText && (
        <button
          onClick={onEditText}
          title={editTextLabel}
          aria-label={editTextLabel}
          className="inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-[#49C1DA] shadow-xs transition-all duration-200 cursor-pointer active:scale-95 group"
        >
          <Edit3 className="w-4 h-4 text-gray-600 group-hover:text-[#49C1DA]" />
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

