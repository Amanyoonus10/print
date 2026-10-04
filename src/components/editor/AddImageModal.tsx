import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, VolumeX, Image as ImageIcon, Video, Link as LinkIcon, FileCheck } from 'lucide-react';
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
  const [itemType, setItemType] = useState<string>(isInitialVid ? 'Video Exhibit (No Sound)' : defaultType);
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

  // Manual URL input state (strictly for external links or server paths)
  const [urlInput, setUrlInput] = useState<string>('');

  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialMediaType or defaultType changes
  useEffect(() => {
    const isVid = initialMediaType === 'video' || defaultType.toLowerCase().includes('video');
    setMediaType(isVid ? 'video' : 'image');
    setItemType(isVid ? 'Video Exhibit (No Sound)' : defaultType);
  }, [initialMediaType, defaultType, isOpen]);

  // Clean reset on close
  const handleModalClose = () => {
    setError('');
    setSuccess(false);
    onClose();
  };

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

    // High performance limits: up to 80MB smoothly handled by IndexedDB without memory strain
    if (file.size > 80 * 1024 * 1024) {
      setError('File is larger than 80MB. Please use an optimized video clip (under 80MB) for best web performance.');
      return;
    }

    try {
      setIsProcessingFile(true);
      setError('');

      // Store in IndexedDB and generate GPU streamable Object URL
      const { id, blobUrl } = await saveMediaBlob(file, file.name);

      setUploadedFileId(id);
      setUploadedBlobUrl(blobUrl);
      setUploadedFileName(file.name);
      setUploadedFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      setSourceMode('upload');

      // Auto-set title from filename if empty
      if (!itemTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setItemTitle(cleanName);
      }

      if (isVideo) {
        setMediaType('video');
        if (!itemType.toLowerCase().includes('video')) {
          setItemType('Video Exhibit (No Sound)');
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

  // Determine active media URL to preview and submit
  const effectiveMediaSrc = sourceMode === 'upload' ? (uploadedBlobUrl || uploadedFileId) : urlInput.trim();
  const storageMediaUrl = sourceMode === 'upload' ? uploadedFileId : urlInput.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Media Source
    if (sourceMode === 'upload') {
      if (!uploadedFileId) {
        setError(mediaType === 'video' ? 'Please upload a video file or switch to Web URL.' : 'Please upload an image file or switch to Web URL.');
        return;
      }
    } else {
      if (!urlInput.trim()) {
        setError('Please enter a web URL or file path.');
        return;
      }
      if (!isValidMediaUrl(urlInput.trim())) {
        setError('Invalid URL format. Please enter a valid URL (starting with https://, http://, or /). Note: Titles or names should be entered in the "Title" field above, not in the URL field.');
        return;
      }
    }

    // 2. Validate Title
    if (!itemTitle.trim()) {
      setError('Please enter a Title / Headline / Caption.');
      return;
    }

    // 3. Security Code
    if (pinCode.trim() !== '7227') {
      setError('Invalid Security Passcode (Hint: 7227). Access denied.');
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
      // Reset form and close
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
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 my-8 text-gray-900"
        >
          {/* Top Close Button */}
          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Close"
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Subtitle Notice */}
          <div className="pr-8 mb-4">
            <h2 className="text-xl font-display font-bold text-gray-900">
              {mediaType === 'video' ? 'Add Video Exhibit' : 'Add Photo / Exhibit'}
            </h2>
            <p className="text-xs text-gray-400 font-sans leading-relaxed mt-0.5">
              High-performance video streaming with hardware GPU decoding. Video exhibits play silently on loop (No Sound).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans leading-relaxed flex items-start gap-2">
                <span className="font-bold shrink-0">Note:</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="font-semibold">Published to website successfully!</span>
              </div>
            )}

            {/* 1. MEDIA FORMAT OPTION: IMAGE VS VIDEO */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                1. Media Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('image');
                    if (itemType.includes('Video')) {
                      setItemType('Gallery Exhibit (Photo / Image)');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    mediaType === 'image'
                      ? 'border-[#49C1DA] bg-[#49C1DA]/10 ring-2 ring-[#49C1DA]/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mediaType === 'image' ? 'bg-[#49C1DA] text-white shadow-xs' : 'bg-gray-100 text-gray-600'}`}>
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-gray-900 truncate">Photo / Image</span>
                    <span className="block text-[10px] text-gray-500 truncate">JPG, PNG, WebP</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    if (!itemType.includes('Video')) {
                      setItemType('Video Exhibit (No Sound)');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    mediaType === 'video'
                      ? 'border-[#49C1DA] bg-[#49C1DA]/10 ring-2 ring-[#49C1DA]/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mediaType === 'video' ? 'bg-[#49C1DA] text-white shadow-xs' : 'bg-gray-100 text-gray-600'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="block text-xs font-bold text-gray-900 truncate">Add Video</span>
                      <VolumeX className="w-3.5 h-3.5 text-[#49C1DA] shrink-0" />
                    </div>
                    <span className="block text-[10px] text-gray-500 truncate">MP4, WebM (No Sound)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Item Type Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Item Type
              </label>
              <select
                value={itemType}
                onChange={(e) => handleItemTypeChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 bg-white cursor-pointer"
              >
                <option value="Video Exhibit (No Sound)">🎬 Video Exhibit (No Sound)</option>
                <option value="Video Reel / Showcase (No Sound)">🎬 Video Reel / Showcase (No Sound)</option>
                <option value="Gallery Exhibit (Photo / Image)">🖼️ Gallery Exhibit (Photo / Image)</option>
                <option value="News Room Announcement">News Room Announcement</option>
                <option value="Project Case Study">Project Case Study</option>
                <option value="Production Facility Feature">Production Facility Feature</option>
                <option value="Service Overview Item">Service Overview Item</option>
              </select>
            </div>

            {/* 3. Title / Headline / Caption */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Title / Headline / Caption
              </label>
              <input
                type="text"
                required
                placeholder="e.g. QSTP Tension Fabric Illumination"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 4. Category / Tag (News only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Category / Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Signage, Branding, Fabric SEG"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 5. Date / Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Subtitle / Material Specs
              </label>
              <input
                type="text"
                placeholder="e.g. Dye-Sublimated Backlit Stretch Fabrics"
                value={itemDateSubtitle}
                onChange={(e) => setItemDateSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 6. Description / Detail Content */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Description / Detail Content
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Illuminated signage and tension fabric systems with uniform edge-to-edge brilliance..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* 7. HIGH-PERFORMANCE MEDIA SOURCE: UPLOAD OR WEB URL */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              {/* Source Mode Switcher */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/80">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  2. Media File or URL
                </span>
                <div className="flex items-center bg-gray-200 p-0.5 rounded-lg text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setSourceMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      sourceMode === 'upload' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode('url')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      sourceMode === 'url' ? 'bg-white text-gray-900 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Or URL Link
                  </button>
                </div>
              </div>

              {sourceMode === 'upload' ? (
                <div>
                  {uploadedFileName ? (
                    /* Clean, lag-free file badge */
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#49C1DA]/40 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#49C1DA]/15 text-[#49C1DA] flex items-center justify-center shrink-0">
                          {mediaType === 'video' ? <Video className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {uploadedFileName}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {uploadedFileSize} • GPU Stream Ready
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveUploadedFile}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove uploaded file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
                        {mediaType === 'video' ? 'Select video from device (.mp4, .webm, .mov)' : 'Select image from device (.jpg, .png, .webp)'}
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={mediaType === 'video' ? 'video/*,.mp4,.webm,.ogg,.mov' : 'image/*'}
                        onChange={handleFileUpload}
                        disabled={isProcessingFile}
                        className="text-xs text-gray-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer w-full"
                      />
                      {isProcessingFile && (
                        <p className="text-xs text-[#49C1DA] font-medium mt-1 animate-pulse">
                          Processing & optimizing media for GPU playback...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span>Enter Direct Video or Image Web Link (HTTPS or /videos/...)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={mediaType === 'video' ? 'https://example.com/video.mp4 or /videos/demo.mp4' : 'https://example.com/photo.jpg'}
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setError('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-gray-900 outline-none focus:border-gray-900"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tip: Do not put item titles here. Direct video URLs must end with .mp4 or start with https://.
                  </p>
                </div>
              )}

              {mediaType === 'video' && (
                <div className="mt-2.5 p-2 rounded-lg bg-[#49C1DA]/10 border border-[#49C1DA]/20 flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-[#49C1DA] shrink-0" />
                  <span className="text-[11px] text-gray-700 font-sans">
                    <strong>Muted Autoplay:</strong> Exhibit video plays silently on a continuous smooth loop without audio.
                  </span>
                </div>
              )}

              {/* Instant Lag-Free Media Preview */}
              {effectiveMediaSrc && (
                <div className="mt-3 relative rounded-xl overflow-hidden aspect-[16/9] border border-gray-200 bg-black max-h-44 shadow-inner">
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
                    title="Remove preview"
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all cursor-pointer z-30"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 8. Security Pincode */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Security Pincode <span className="text-gray-400 font-normal">(7227)</span>
              </label>
              <input
                type="password"
                placeholder="Enter PIN 7227 to publish"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400 font-mono"
              />
            </div>

            {/* 9. Publish Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessingFile}
                className="w-full py-3.5 rounded-full bg-[#49C1DA] hover:bg-[#32AEC8] active:bg-[#259ab2] text-white font-sans text-sm font-bold tracking-wide transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Publish to Website</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
