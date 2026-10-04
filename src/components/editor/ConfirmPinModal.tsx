import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ConfirmPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmPinModal: React.FC<ConfirmPinModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Security Authorization',
  description = 'Please enter your security PIN to authorize this action.',
  actionLabel = 'Authorize Action',
  isDestructive = true,
}) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPinCode('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  // Press Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim() !== '7227') {
      setError('Invalid Security PIN. Access denied.');
      return;
    }

    setError('');
    setSuccess(true);

    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 text-gray-900 overflow-hidden p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon + Title */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDestructive ? 'bg-red-50 text-red-600' : 'bg-[#49C1DA]/15 text-[#49C1DA]'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                PIN Verification Required
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-sans mb-4 leading-relaxed">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            {success && (
              <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>PIN verified successfully.</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Enter Security PIN:
              </label>
              <input
                type="password"
                autoFocus
                placeholder="••••"
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#49C1DA] outline-none text-center font-mono text-sm tracking-widest text-gray-900 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-full text-white font-sans text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#49C1DA] hover:bg-[#32AEC8]'
                }`}
              >
                {actionLabel}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
