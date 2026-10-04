import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Volume2, Image as ImageIcon, Video, Link as LinkIcon, FileCheck } from 'lucide-react';
import { isVideoSource, isValidMediaUrl } from '../../utils/media';
import { saveMediaBlob } from '../../utils/mediaStorage';
import { MediaRenderer } from '../ui/MediaRenderer';

export interface AddMediaItemData {
  url: string;
  mediaType?: 'image' | 'video';
  title: string;
  category?: string;
  subtitle?: string;
  caption?: string;
  description?: string;
  itemType?: string;
}

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  defaultType?: string;
  initialMediaType?: 'image' | 'video';
  requireDescription?: boolean;
  onAdd: (data: AddMediaItemData) => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'Gallery Exhibit (Photo / Image)',
  initialMediaType = 'image',
  onAdd,
}) => {
  const isInitialVid = initialMediaType === 'video' || defaultType.toLowerCase().includes('video');
  const [itemType, setItemType] = useState<string>(isInitialVid ? 'Video Exhibit' : defaultType);
  const [itemTitle, setItemTitle] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<string>('');
  const [itemDateSubtitle, setItemDateSubtitle] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');

  // Mode and media state
  const [mediaType, setMediaType] = useState<'image' | 'video'>(isInitialVid ? 'video' : 'image');
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');

  // File upload state (stores IndexedDB persistent ID and fast streaming preview)
  const [uploadedFileId, setUploadedFileId] = useState<string>('');
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  // Manual URL input state
  const [urlInput, setUrlInput] = useState<string>('');

  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialMediaType or defaultType changes
  useEffect(() => {
    const isVid = initialMediaType === 'video' || defaultType.toLowerCase().includes('video');
    setMediaType(isVid ? 'video' : 'image');
    setItemType(isVid ? 'Video Exhibit' : defaultType);
  }, [initialMediaType, defaultType, isOpen]);

  // Keyboard shortcut: Press Escape to close modal
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setError('Please select a valid image (JPG, PNG, WebP) or video (MP4, WebM, MOV) file.');
      return;
    }

    if (file.size > 80 * 1024 * 1024) {
      setError('File is larger than 80MB. Please use an optimized video clip for best web performance.');
      return;
    }

    try {
      setIsProcessingFile(true);
      setError('');

      const { id, blobUrl } = await saveMediaBlob(file, file.name);

      setUploadedFileId(id);
      setUploadedBlobUrl(blobUrl);
      setUploadedFileName(file.name);
      setUploadedFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      setSourceMode('upload');

      if (!itemTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItemTitle(cleanName);
      }

      if (isVideo) {
        setMediaType('video');
        if (!itemType.toLowerCase().includes('video')) {
          setItemType('Video Exhibit');
        }
      } else {
        setMediaType('image');
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('Failed to process media file. Please try again.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFileId('');
    setUploadedBlobUrl('');
    setUploadedFileName('');
    setUploadedFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleItemTypeChange = (newType: string) => {
    setItemType(newType);
    if (newType.toLowerCase().includes('video')) {
      setMediaType('video');
    } else if (newType.toLowerCase().includes('photo') || newType.toLowerCase().includes('image')) {
      setMediaType('image');
    }
  };

  const effectiveMediaSrc = sourceMode === 'upload' ? (uploadedBlobUrl || uploadedFileId) : urlInput.trim();
  const storageMediaUrl = sourceMode === 'upload' ? uploadedFileId : urlInput.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (sourceMode === 'upload') {
      if (!uploadedFileId) {
        setError(mediaType === 'video' ? 'Please upload a video file or switch to URL Link.' : 'Please upload an image file or switch to URL Link.');
        return;
      }
    } else {
      if (!urlInput.trim()) {
        setError('Please enter a web URL or file path.');
        return;
      }
      if (!isValidMediaUrl(urlInput.trim())) {
        setError('Invalid URL format. Direct link must start with https://, http://, or / (e.g. /videos/project.mp4). Titles should be entered in the Title field.');
        return;
      }
    }

    if (!itemTitle.trim()) {
      setError('Please enter a Title / Caption.');
      return;
    }

    if (pinCode.trim() !== '7227') {
      setError('Invalid Security PIN. Access denied.');
      return;
    }

    const determinedType = isVideoSource(effectiveMediaSrc, mediaType) ? 'video' : 'image';

    onAdd({
      url: storageMediaUrl,
      mediaType: determinedType,
      title: itemTitle.trim(),
      category: itemCategory.trim() || undefined,
      subtitle: itemDateSubtitle.trim() || undefined,
      caption: itemDescription.trim() || itemDateSubtitle.trim() || undefined,
      description: itemDescription.trim() || undefined,
      itemType,
    });

    setSuccess(true);
    setTimeout(() => {
      setItemTitle('');
      setItemCategory('');
      setItemDateSubtitle('');
      setItemDescription('');
      setUploadedFileId('');
      setUploadedBlobUrl('');
      setUploadedFileName('');
      setUploadedFileSize('');
      setUrlInput('');
      setMediaType('image');
      setPinCode('');
      setError('');
      setSuccess(false);
      onClose();
    }, 350);
  };

  return (
    <AnimatePresence>
      {/* Dark backdrop with click-outside to close */}
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 text-gray-900 flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. FIXED STICKY TOP HEADER WITH PROMINENT CLOSE TAB */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-display font-bold text-sm sm:text-base text-gray-900 truncate">
                {mediaType === 'video' ? 'Add Video Exhibit' : 'Add Photo Exhibit'}
              </span>

              {/* Compact Photo / Video Pill Toggle */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('image');
                    if (itemType.includes('Video')) {
                      setItemType('Gallery Exhibit (Photo / Image)');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    mediaType === 'image'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-[#49C1DA]" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    if (!itemType.includes('Video')) {
                      setItemType('Video Exhibit');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    mediaType === 'video'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Video className="w-3 h-3 text-[#49C1DA]" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* UNMISTAKABLE PROMINENT CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              title="Close modal (Esc)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 hover:text-gray-900 transition-all cursor-pointer text-xs font-semibold shrink-0 border border-gray-200"
            >
              <span>Close</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. COMPACT SCROLLABLE FORM BODY */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto px-4 sm:px-5 py-3.5 space-y-3 flex-1 text-xs">
              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-sans flex items-start gap-2">
                  <span className="font-bold shrink-0">Note:</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[11px] font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="font-semibold">Published to website successfully!</span>
                </div>
              )}

              {/* Row 1: Item Type + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Item Type
                  </label>
                  <select
                    value={itemType}
                    onChange={(e) => handleItemTypeChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 bg-white cursor-pointer"
                  >
                    <option value="Video Exhibit">🎬 Video Exhibit (With Audio)</option>
                    <option value="Video Reel / Showcase">🎬 Video Reel / Showcase</option>
                    <option value="Gallery Exhibit (Photo / Image)">🖼️ Gallery Photo Exhibit</option>
                    <option value="News Room Announcement">News Announcement</option>
                    <option value="Project Case Study">Project Case Study</option>
                    <option value="Service Overview Item">Service Overview Item</option>
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Title / Caption <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QSTP Tension Fabric Illumination"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 2: Subtitle/Specs + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Subtitle / Specs
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dye-Sublimated Fabric"
                    value={itemDateSubtitle}
                    onChange={(e) => setItemDateSubtitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Category / Tag <span className="font-normal text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signage, Branding"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Description / Detail Content
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Detailed breakdown of technical specifications or project features..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Row 4: MEDIA SOURCE (Upload vs URL) */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <span>Media File</span>
                    {mediaType === 'video' && (
                      <span className="text-[10px] text-[#49C1DA] font-mono font-medium flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        (Sound Supported)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center bg-gray-200 p-0.5 rounded-md text-[10px] font-medium">
                    <button
                      type="button"
                      onClick={() => setSourceMode('upload')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        sourceMode === 'upload' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceMode('url')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        sourceMode === 'url' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      URL Link
                    </button>
                  </div>
                </div>

                {sourceMode === 'upload' ? (
                  <div>
                    {uploadedFileName ? (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#49C1DA]/40 shadow-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-md bg-[#49C1DA]/15 text-[#49C1DA] flex items-center justify-center shrink-0">
                            {mediaType === 'video' ? <Video className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {uploadedFileName}
                            </p>
                            <p className="text-[9px] text-gray-500 font-mono">
                              {uploadedFileSize} • Stream Ready
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveUploadedFile}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={mediaType === 'video' ? 'video/*,.mp4,.webm,.ogg,.mov' : 'image/*'}
                          onChange={handleFileUpload}
                          disabled={isProcessingFile}
                          className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer w-full"
                        />
                        {isProcessingFile && (
                          <p className="text-[10px] text-[#49C1DA] font-medium mt-1 animate-pulse">
                            Optimizing video for smooth GPU playback...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        placeholder={mediaType === 'video' ? 'https://.../video.mp4 or /videos/project.mp4' : 'https://.../image.jpg'}
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          setError('');
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 outline-none focus:border-[#49C1DA]"
                      />
                    </div>
                  </div>
                )}

                {/* Instant Compact Preview */}
                {effectiveMediaSrc && (
                  <div className="mt-2 relative rounded-lg overflow-hidden aspect-[16/9] border border-gray-200 bg-black max-h-32 shadow-inner">
                    <MediaRenderer
                      src={effectiveMediaSrc}
                      mediaType={mediaType}
                      alt={itemTitle || 'Preview exhibit'}
                      showMutedIndicator={mediaType === 'video'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveUploadedFile();
                        setUrlInput('');
                      }}
                      title="Clear preview"
                      className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all cursor-pointer z-30"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. FIXED STICKY BOTTOM FOOTER (PINCODE + PUBLISH ALWAYS IN VIEW) */}
            <div className="sticky bottom-0 z-30 bg-gray-50 border-t border-gray-200 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-600 whitespace-nowrap">PIN:</span>
                <input
                  type="password"
                  placeholder="••••"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-gray-300 focus:border-[#49C1DA] outline-none text-xs text-gray-900 placeholder:text-gray-400 font-mono text-center bg-white tracking-widest"
                />
              </div>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingFile}
                  className="px-5 py-2 rounded-full bg-[#49C1DA] hover:bg-[#32AEC8] active:scale-98 text-white font-sans text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Publish Exhibit
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
