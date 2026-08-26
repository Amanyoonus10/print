import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RotateCcw } from 'lucide-react';

export interface RemovableItem {
  id?: string;
  index?: number;
  title: string;
  subtitle?: string;
  url: string;
}

interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  items: RemovableItem[];
  onRemoveItem: (item: RemovableItem, index: number) => void;
  onClearAll?: () => void;
}

export const RemoveItemModal: React.FC<RemoveItemModalProps> = ({
  isOpen,
  onClose,
  title = 'Remove Images & Items',
  subtitle = 'Manage Section Content',
  items,
  onRemoveItem,
  onClearAll,
}) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleAuthorizedRemove = (item: RemovableItem, index: number) => {
    if (pinCode.trim() !== '7227') {
      setError('Invalid Passcode. Please enter security passcode 7227 to remove items.');
      return;
    }
    setError('');
    onRemoveItem(item, index);
  };

  const handleAuthorizedClearAll = () => {
    if (pinCode.trim() !== '7227') {
      setError('Invalid Passcode. Please enter security passcode 7227 to reset section.');
      return;
    }
    if (window.confirm('Are you sure you want to clear all added items in this section?')) {
      setError('');
      if (onClearAll) onClearAll();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 my-8 text-gray-900 flex flex-col max-h-[85vh]"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-mono text-red-600 font-bold uppercase tracking-wider block">
                {subtitle}
              </span>
              <h3 className="font-display font-bold text-xl text-gray-900 mt-0.5">
                {title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Security Passcode Field */}
          <div className="pt-4 pb-2">
            <label className="block text-xs font-semibold text-gray-900 mb-1.5 flex items-center justify-between">
              <span>Security Passcode</span>
              <span className="text-[11px] font-mono text-gray-400 font-normal">PIN required</span>
            </label>
            <input
              type="password"
              placeholder="Enter passcode 7227 to authorize"
              value={pinCode}
              onChange={(e) => {
                setPinCode(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="p-3 my-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
              {error}
            </div>
          )}

          {/* Notice */}
          <p className="text-xs text-gray-500 font-sans mt-2 mb-3">
            Enter passcode <strong className="text-gray-800">7227</strong> and click Remove next to any item below:
          </p>

          {/* Items List */}
          <div className="overflow-y-auto space-y-3 py-1 pr-1 flex-grow">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-sm text-gray-900 truncate">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="font-mono text-xs text-gray-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAuthorizedRemove(item, idx)}
                  title="Remove this item"
                  className="px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-sans text-sm">
                No items currently in this section to remove.
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            {onClearAll && items.length > 0 ? (
              <button
                type="button"
                onClick={handleAuthorizedClearAll}
                className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Section to Defaults</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-sans text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
