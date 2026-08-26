import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText } from 'lucide-react';

export interface TextFieldConfig {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: TextFieldConfig[];
  onSave: (values: Record<string, string>) => void;
}

export const EditTextModal: React.FC<EditTextModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  fields,
  onSave,
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string> = {};
      fields.forEach(f => {
        initial[f.key] = f.value || '';
      });
      setFormValues(initial);
      setPinCode('');
      setError('');
    }
  }, [isOpen, fields]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim() !== '7227') {
      setError('Invalid Security Passcode. Access denied.');
      return;
    }
    setError('');
    onSave(formValues);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8 text-gray-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE8DE] bg-[#F7F4EE]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#B8955A] uppercase tracking-widest font-bold block">
                  {subtitle || 'Text & Copy Editor'}
                </span>
                <h3 className="font-display font-bold text-xl text-[#171717] mt-0.5">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EDE8DE] text-gray-400 hover:text-[#171717] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            {fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] font-bold mb-1.5">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    rows={field.rows || 3}
                    placeholder={field.placeholder}
                    value={formValues[field.key] ?? ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8DE] focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20 outline-none text-sm text-[#171717] resize-y leading-relaxed bg-[#F7F4EE]"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formValues[field.key] ?? ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8DE] focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20 outline-none text-sm text-[#171717] bg-[#F7F4EE]"
                  />
                )}
              </div>
            ))}

            {/* Security Passcode Field */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#171717] mb-1.5 flex items-center justify-between">
                <span>Security Passcode</span>
                <span className="text-[11px] font-mono text-gray-400 font-normal">PIN required</span>
              </label>
              <input
                type="password"
                placeholder="Enter PIN to save"
                value={pinCode}
                onChange={e => {
                  setPinCode(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8DE] focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] outline-none text-sm text-[#171717] placeholder:text-gray-400 bg-[#F7F4EE]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE8DE]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold text-gray-600 hover:bg-[#EDE8DE] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#7A1F2B] hover:bg-[#631621] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
