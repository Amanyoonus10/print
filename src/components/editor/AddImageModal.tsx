import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, VolumeX, Image as ImageIcon, Video } from 'lucide-react';
import { isVideoSource } from '../../utils/media';

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
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(isInitialVid ? 'video' : 'image');
  const [pinCode, setPinCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Sync state if initialMediaType or defaultType changes
  useEffect(() => {
    const isVid = initialMediaType === 'video' || defaultType.toLowerCase().includes('video');
    setMediaType(isVid ? 'video' : 'image');
    setItemType(isVid ? 'Video Exhibit (No Sound)' : defaultType);
  }, [initialMediaType, defaultType]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setError('Please select a valid image (JPG, PNG, WebP) or video (MP4, WebM, MOV) file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File is larger than 25MB. Browser LocalStorage may exceed quota. Please use a shorter video clip or provide a direct video URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMediaUrl(result);
      setMediaType(isVideo ? 'video' : 'image');
      if (isVideo) {
        setItemType('Video Exhibit (No Sound)');
      }
      setError('');
      if (!itemTitle) {
        setItemTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    setError('');
    if (isVideoSource(url)) {
      setMediaType('video');
      setItemType('Video Exhibit (No Sound)');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) {
      setError(mediaType === 'video' ? 'Please upload a video file or provide a video URL.' : 'Please upload an image file or provide an image URL.');
      return;
    }
    if (!itemTitle.trim()) {
      setError('Please enter a Title / Headline / Caption.');
      return;
    }
    if (pinCode.trim() !== '7227') {
      setError('Invalid Security Passcode. Access denied.');
      return;
    }

    const determinedType = isVideoSource(mediaUrl, mediaType) ? 'video' : 'image';

    onAdd({
      url: mediaUrl,
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
      setMediaUrl('');
      setMediaType('image');
      setPinCode('');
      setError('');
      setSuccess(false);
      onClose();
    }, 400);
  };

  const isCurrentVideo = isVideoSource(mediaUrl, mediaType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
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
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Subtitle Notice */}
          <p className="text-xs text-gray-400 font-sans leading-relaxed pr-8 mb-5">
            This admin panel stores data locally (LocalStorage) and renders updates in real-time.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Published to website successfully!</span>
              </div>
            )}

            {/* 1. MEDIA FORMAT OPTION: IMAGE VS VIDEO */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                1. Choose Option: Photo or Video
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
                placeholder="e.g. Distributor Program launched in Dubai"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 4. Category / Tag (News only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Category / Tag (News only)
              </label>
              <input
                type="text"
                placeholder="e.g. Export, Education, Milestone"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 5. Date / Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Date / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Year 1, Month 3 or 2026"
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
                rows={3}
                placeholder="e.g. Detailed breakdown of events..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* 7. Upload File or URL based on Media Option */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <label className="block text-xs font-bold text-gray-900 mb-1">
                {mediaType === 'video' ? 'Upload Video File (.mp4, .webm, .mov)' : 'Upload Image File (.jpg, .png, .webp)'}
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === 'video' ? 'video/*,.mp4,.webm,.ogg,.mov' : 'image/*'}
                  onChange={handleFileUpload}
                  className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer w-full"
                />
              </div>

              {/* Or manual URL */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-sans shrink-0 font-medium">Or URL:</span>
                <input
                  type="text"
                  placeholder={mediaType === 'video' ? 'e.g. /videos/hero_video_1.mp4 or https://.../video.mp4' : 'https://...'}
                  value={mediaUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {mediaType === 'video' && (
                <p className="mt-2 text-[11px] text-gray-500 font-sans flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-[#49C1DA] shrink-0" />
                  <span><strong>No Sound:</strong> Video will automatically play silently on a smooth loop without audio.</span>
                </p>
              )}

              {/* Media Preview thumbnail / video player if selected */}
              {mediaUrl && (
                <div className="mt-3 relative rounded-xl overflow-hidden aspect-[16/9] border border-gray-200 bg-black max-h-40">
                  {isCurrentVideo ? (
                    <>
                      <video
                        ref={(el) => {
                          videoPreviewRef.current = el;
                          if (el) {
                            el.muted = true;
                            el.defaultMuted = true;
                          }
                        }}
                        src={mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-white/20">
                        <VolumeX className="w-3 h-3 text-[#49C1DA]" />
                        <span>Muted Video (No Sound)</span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Uploaded thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMediaUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    title="Remove media"
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 8. Security Pincode */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Security Pincode
              </label>
              <input
                type="password"
                placeholder="Enter PIN to publish"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* 9. Publish Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#49C1DA] hover:bg-[#32AEC8] text-white font-sans text-sm font-bold tracking-wide transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
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
