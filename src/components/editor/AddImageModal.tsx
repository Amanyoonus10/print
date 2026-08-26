import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  requireDescription?: boolean;
  onAdd: (data: { url: string; title: string; subtitle?: string; caption?: string; description?: string }) => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  requireDescription = false,
  onAdd,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [itemTitle, setItemTitle] = useState<string>('');
  const [itemSubtitle, setItemSubtitle] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError('');
      if (!itemTitle) {
        setItemTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreview(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Please select or provide an image.');
      return;
    }
    if (!itemTitle.trim()) {
      setError('Please provide a title for this image.');
      return;
    }

    onAdd({
      url: imagePreview,
      title: itemTitle.trim(),
      subtitle: itemSubtitle.trim() || undefined,
      caption: itemDescription.trim() || itemSubtitle.trim() || undefined,
      description: itemDescription.trim() || undefined,
    });

    // Reset and close
    setImagePreview('');
    setItemTitle('');
    setItemSubtitle('');
    setItemDescription('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <span className="font-mono text-[10px] text-[#008BA3] uppercase tracking-widest font-bold block">
                {subtitle || 'Content Editor'}
              </span>
              <h3 className="font-display font-bold text-xl text-gray-900 mt-0.5">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {error}
              </div>
            )}

            {/* Upload Method Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-[#0A0B0D] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                📁 Upload From Computer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all ${
                  activeTab === 'url'
                    ? 'bg-white text-[#0A0B0D] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                🔗 Image URL
              </button>
            </div>

            {/* Image Source Input */}
            {activeTab === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#00BCD4] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#00BCD4]/5 flex flex-col items-center justify-center gap-2 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-[#00BCD4] group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Click to select an image from your device
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Supports JPG, PNG, WebP, SVG
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Image Web URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imagePreview}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-sm text-gray-900"
                />
              </div>
            )}

            {/* Preview Box */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-200 bg-gray-900 shadow-inner">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setError('Could not load image from this URL.')}
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#38E1FF]" />
                  Preview Ready
                </div>
              </div>
            )}

            {/* Title Field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Image Title / Exhibit Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ultra-HD Acrylic Lightbox"
                value={itemTitle}
                onChange={e => setItemTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-sm text-gray-900"
              />
            </div>

            {/* Subtitle / Tag */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Subtitle / Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Doha Production Facility"
                value={itemSubtitle}
                onChange={e => setItemSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-sm text-gray-900"
              />
            </div>

            {/* Description / Caption */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Description / Caption {requireDescription && '*'}
              </label>
              <textarea
                rows={3}
                placeholder="Details about this equipment, print technique, or client deliverable..."
                value={itemDescription}
                onChange={e => setItemDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#00BCD4] focus:ring-2 focus:ring-[#00BCD4]/20 outline-none text-sm text-gray-900 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save to Section</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
