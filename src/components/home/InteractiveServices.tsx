import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { SectionEditorBar } from '../editor/SectionEditorBar';
import { AddImageModal } from '../editor/AddImageModal';
import { EditTextModal } from '../editor/EditTextModal';

export const InteractiveServices: React.FC = () => {
  const { services, updateService, addServiceGalleryImage } = useContent();
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>(services[0]?.slug || '');
  const [isAddImageOpen, setIsAddImageOpen] = useState<boolean>(false);
  const [isEditTextOpen, setIsEditTextOpen] = useState<boolean>(false);

  const activeService = services.find(s => s.slug === activeServiceSlug) || services[0];

  const handleSaveText = (values: Record<string, string>) => {
    if (!activeService) return;
    updateService(activeService.slug, {
      title: values.title,
      subtitle: values.subtitle,
      shortDescription: values.shortDescription,
    });
  };

  const handleAddImage = (data: { url: string; title: string; caption?: string }) => {
    if (!activeService) return;
    // Update hero image if requested or add to gallery
    updateService(activeService.slug, {
      heroImage: data.url,
    });
    addServiceGalleryImage(activeService.slug, {
      url: data.url,
      title: data.title,
      caption: data.caption,
    });
  };

  if (!activeService) return null;

  return (
    <section className="relative py-28 md:py-36 bg-[#F8FAFC] border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Editor Bar */}
        <SectionEditorBar
          sectionName={`02 / Services (${activeService.title})`}
          addImageLabel="Change Preview Image"
          editTextLabel="Edit Active Service"
          onAddImage={() => setIsAddImageOpen(true)}
          onEditText={() => setIsEditTextOpen(true)}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            number="02"
            tag="SERVICES & CAPABILITIES"
            title="EXPLORE OUR CORE PILLARS."
            subtitle="Interactive capabilities directory engineered for modern brands in Qatar."
          />

          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#008BA3] hover:text-[#00BCD4] font-bold uppercase tracking-widest self-start md:self-end pb-2 group"
          >
            <span>View All {services.length} Service Hubs</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* 2-Column Desktop Grid: Left List + Right Floating Live Preview Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Service Item Stack */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-gray-200">
            {services.map((service) => {
              const isCurrent = activeService.id === service.id;

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => {
                    setActiveServiceSlug(service.slug);
                  }}
                  className="group relative py-6 sm:py-7 transition-all duration-300 cursor-pointer"
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Index Number */}
                      <span className={`font-mono text-xs sm:text-sm transition-colors duration-300 font-bold ${
                        isCurrent ? 'text-[#008BA3]' : 'text-gray-400 group-hover:text-gray-900'
                      }`}>
                        {service.number}
                      </span>

                      {/* Main Service Title */}
                      <h3 className={`font-display font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight transition-all duration-300 ${
                        isCurrent
                          ? 'text-gray-900 translate-x-2'
                          : 'text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1'
                      }`}>
                        {service.title}
                      </h3>
                    </div>

                    {/* Arrow Action */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isCurrent
                        ? 'border-[#00BCD4] bg-[#00BCD4] text-[#0A0B0D] shadow-[0_0_15px_rgba(0,188,212,0.35)]'
                        : 'border-gray-300 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-900'
                    }`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>

                  {/* Subtitle preview for mobile */}
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="lg:hidden mt-3 text-xs sm:text-sm text-gray-600 font-sans pl-8 sm:pl-12"
                    >
                      {service.shortDescription}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Floating Visual Preview Card with Spring Physics */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                >
                  {/* Background Image from PDF */}
                  <img
                    src={activeService.heroImage}
                    alt={activeService.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-between" />

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="font-mono text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                      {activeService.number} — {activeService.title}
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2">
                    <p className="font-display font-bold text-lg text-white leading-snug">
                      {activeService.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/15">
                      <span className="text-[11px] font-mono text-[#38E1FF]">
                        {activeService.materials[0]}
                      </span>
                      <span className="text-[11px] font-mono text-white/80">
                        {activeService.gallery.length} Verified Exhibits
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Change Image Modal */}
      <AddImageModal
        isOpen={isAddImageOpen}
        onClose={() => setIsAddImageOpen(false)}
        title={`Change Image for ${activeService.title}`}
        subtitle="Service Preview Artwork"
        onAdd={handleAddImage}
      />

      {/* Edit Service Details Modal */}
      <EditTextModal
        isOpen={isEditTextOpen}
        onClose={() => setIsEditTextOpen(false)}
        title={`Edit ${activeService.title}`}
        subtitle="Pillar Specification"
        fields={[
          {
            key: 'title',
            label: 'Service Name',
            value: activeService.title,
          },
          {
            key: 'subtitle',
            label: 'Subtitle / Tagline',
            value: activeService.subtitle,
          },
          {
            key: 'shortDescription',
            label: 'Short Description',
            value: activeService.shortDescription,
            multiline: true,
            rows: 3,
          },
        ]}
        onSave={handleSaveText}
      />
    </section>
  );
};

