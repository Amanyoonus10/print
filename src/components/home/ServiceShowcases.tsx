import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SectionEditorBar } from '../editor/SectionEditorBar';
import { AddImageModal } from '../editor/AddImageModal';
import { EditTextModal } from '../editor/EditTextModal';
import { RemoveItemModal } from '../editor/RemoveItemModal';
import type { ServiceItem } from '../../types';

export const ServiceShowcases: React.FC<{ onOpenQuoteModal?: () => void }> = ({ onOpenQuoteModal }) => {
  const { services, updateService, addServiceGalleryImage, removeServiceGalleryImage, resetToDefaults } = useContent();

  const [activeAddService, setActiveAddService] = useState<ServiceItem | null>(null);
  const [activeRemoveService, setActiveRemoveService] = useState<ServiceItem | null>(null);
  const [activeEditService, setActiveEditService] = useState<ServiceItem | null>(null);

  const handleSaveText = (values: Record<string, string>) => {
    if (!activeEditService) return;
    updateService(activeEditService.slug, {
      title: values.title,
      subtitle: values.subtitle,
      fullDescription: values.fullDescription,
    });
  };

  const handleAddImage = (data: { url: string; title: string; caption?: string }) => {
    if (!activeAddService) return;
    addServiceGalleryImage(activeAddService.slug, {
      url: data.url,
      title: data.title,
      caption: data.caption,
    });
  };

  return (
    <div id="services-showcases" className="w-full flex flex-col bg-[#FFFFFF]">
      {services.map((service, index) => {
        const isEven = index % 2 === 0;

        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`relative py-24 md:py-32 border-b border-gray-200 overflow-hidden ${
              isEven ? 'bg-[#FFFFFF]' : 'bg-[#F8FAFC]'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-1/2 ${isEven ? 'left-0' : 'right-0'} -translate-y-1/2 w-96 h-96 bg-[#00BCD4]/5 rounded-full blur-3xl pointer-events-none`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Section Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#008BA3] px-3 py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25">
                    {service.number}
                  </span>
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">
                    Specialized Production
                  </span>
                </div>

                <SectionEditorBar
                  addImageLabel={`Add ${service.title} Item`}
                  clearDataLabel="Clear Added Data"
                  editTextLabel="Edit Description"
                  onAddImage={() => setActiveAddService(service)}
                  onClearData={() => setActiveRemoveService(service)}
                  onEditText={() => setActiveEditService(service)}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 flex flex-col gap-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  {/* Oversized Title */}
                  <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#0A0B0D] tracking-tight uppercase leading-[1.05]">
                    {service.title}
                  </h2>

                  {/* Subtitle / Statement */}
                  <p className="text-lg md:text-xl font-medium text-[#008BA3] leading-snug">
                    “{service.subtitle}”
                  </p>

                  {/* Full Description */}
                  <p className="text-base text-gray-600 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {service.features.slice(0, 4).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                        <span className="text-xs font-mono text-gray-800 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deep Dive Action Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    {onOpenQuoteModal ? (
                      <button
                        onClick={onOpenQuoteModal}
                        className="px-6 py-3.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.3)] cursor-pointer group"
                      >
                        <span>Inquire {service.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    ) : (
                      <a
                        href={`https://wa.me/97433635098?text=Hello%20FACE%20PRINTING,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.3)]"
                      >
                        <span>Inquire {service.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <a
                      href="https://wa.me/97433635098"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-xs uppercase tracking-wider border border-gray-200 transition-all font-medium"
                    >
                      WhatsApp Specs
                    </a>
                  </div>
                </motion.div>

                {/* Visual Imagery Side */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`lg:col-span-6 flex flex-col gap-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  {/* Primary Large Image */}
                  <div className="relative rounded-3xl overflow-hidden aspect-[16/11] bg-gray-100 border border-gray-200 group shadow-lg">
                    <img
                      src={service.heroImage}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-[#38E1FF] uppercase tracking-widest block font-bold">
                          Production Standard
                        </span>
                        <span className="font-display font-bold text-lg text-white">
                          {service.materials[0] || 'Precision Grade Materials'}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {service.gallery.length} Exhibits
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Supporting Detail Images */}
                  <div className="grid grid-cols-2 gap-4">
                    {service.gallery.slice(0, 4).map((item, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 group shadow-xs"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <p className="text-[11px] font-display font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] font-mono text-gray-300 truncate">
                            {item.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Add Gallery Image Modal */}
      {activeAddService && (
        <AddImageModal
          isOpen={!!activeAddService}
          onClose={() => setActiveAddService(null)}
          title={`Add Exhibit to ${activeAddService.title}`}
          subtitle="Service Gallery"
          onAdd={handleAddImage}
        />
      )}

      {/* Remove Gallery Items Modal */}
      {activeRemoveService && (
        <RemoveItemModal
          isOpen={!!activeRemoveService}
          onClose={() => setActiveRemoveService(null)}
          title={`Remove Exhibits from ${activeRemoveService.title}`}
          subtitle="Manage Gallery Exhibits"
          items={activeRemoveService.gallery.map((g, idx) => ({
            index: idx,
            title: g.title,
            subtitle: g.caption,
            url: g.url,
          }))}
          onRemoveItem={(_, idx) => {
            removeServiceGalleryImage(activeRemoveService.slug, idx);
          }}
          onClearAll={resetToDefaults}
        />
      )}

      {/* Edit Service Description Modal */}
      {activeEditService && (
        <EditTextModal
          isOpen={!!activeEditService}
          onClose={() => setActiveEditService(null)}
          title={`Edit ${activeEditService.title}`}
          subtitle="Service Copy & Description"
          fields={[
            {
              key: 'title',
              label: 'Service Heading',
              value: activeEditService.title,
            },
            {
              key: 'subtitle',
              label: 'Subtitle Quote',
              value: activeEditService.subtitle,
            },
            {
              key: 'fullDescription',
              label: 'Full Detailed Description',
              value: activeEditService.fullDescription,
              multiline: true,
              rows: 4,
            },
          ]}
          onSave={handleSaveText}
        />
      )}
    </div>
  );
};

