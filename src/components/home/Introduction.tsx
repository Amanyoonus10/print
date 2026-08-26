import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { SectionEditorBar } from '../editor/SectionEditorBar';
import { AddImageModal } from '../editor/AddImageModal';
import { EditTextModal } from '../editor/EditTextModal';
import { RemoveItemModal } from '../editor/RemoveItemModal';

export const Introduction: React.FC = () => {
  const { company, introImages, updateCompanyDescription, addIntroImage, removeIntroImage, resetToDefaults } = useContent();

  const [isAddImageOpen, setIsAddImageOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isEditTextOpen, setIsEditTextOpen] = useState<boolean>(false);

  const handleSaveText = (values: Record<string, string>) => {
    updateCompanyDescription({
      body1: values.body1,
      body2: values.body2,
      body3: values.body3,
    });
  };

  return (
    <section id="introduction" className="relative py-28 md:py-36 bg-[#F7F4EE] overflow-hidden border-b border-[#EDE8DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Pill Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            number="01"
            tag="COMPANY PROFILE & STORY"
            title="PRINTING THAT MAKES YOUR BRAND STAND OUT."
            subtitle="Precision, creativity, and structural quality engineered in Doha, Qatar."
          />

          <SectionEditorBar
            addImageLabel="Add Facility Image"
            clearDataLabel="Clear Added Data"
            editTextLabel="Edit Narrative"
            onAddImage={() => setIsAddImageOpen(true)}
            onClearData={() => setIsRemoveModalOpen(true)}
            onEditText={() => setIsEditTextOpen(true)}
          />
        </div>

        {/* Asymmetrical Editorial 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Official PDF Copy & Core Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EDE8DE] relative overflow-hidden shadow-md"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7A1F2B] via-[#B8955A] to-transparent" />

              <p className="font-display font-medium text-xl sm:text-2xl text-[#171717] leading-relaxed">
                “{company.description.body1}”
              </p>

              <div className="my-6 h-[1px] bg-[#EDE8DE]" />

              <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
                {company.description.body2}
              </p>

              <p className="mt-4 text-base sm:text-lg text-[#555555] leading-relaxed">
                {company.description.body3}
              </p>

              {/* Verified Strengths List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#EDE8DE]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-mono text-[#171717] font-semibold">
                    Advanced Printing Technology
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-mono text-[#171717] font-semibold">
                    Skilled Designers & Pre-Press
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-mono text-[#171717] font-semibold">
                    Quality Certified Materials
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B8955A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-mono text-[#171717] font-semibold">
                    Expert Craftsmanship
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    const el = document.getElementById('services');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#7A1F2B] hover:text-[#B8955A] transition-colors uppercase font-bold cursor-pointer"
                >
                  <span>Explore 8 Production Pillars</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Composition & Production Machinery */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {introImages.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="relative rounded-3xl overflow-hidden aspect-[16/11] bg-white border border-[#EDE8DE] group shadow-md"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  {img.subtitle && (
                    <span className="font-mono text-[10px] text-[#B8955A] uppercase tracking-widest font-bold block">
                      {img.subtitle}
                    </span>
                  )}
                  <h4 className="font-display font-bold text-base sm:text-lg text-white mt-1">
                    {img.title}
                  </h4>
                </div>
              </motion.div>
            ))}

            {introImages.length === 0 && (
              <div className="p-10 rounded-3xl border-2 border-dashed border-[#EDE8DE] text-center flex flex-col items-center justify-center gap-3 bg-white">
                <p className="text-sm font-mono text-[#555555]">No images in this section.</p>
                <button
                  onClick={() => setIsAddImageOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#7A1F2B] text-white font-mono text-xs uppercase font-bold cursor-pointer"
                >
                  + Add An Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Image Modal */}
      <AddImageModal
        isOpen={isAddImageOpen}
        onClose={() => setIsAddImageOpen(false)}
        title="Add Image to Company Story"
        subtitle="Introduction Gallery"
        onAdd={data => addIntroImage({ url: data.url, title: data.title, subtitle: data.subtitle })}
      />

      {/* Remove Intro Images Modal */}
      <RemoveItemModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Remove Facility & Story Images"
        subtitle="Manage Company Story Media"
        items={introImages.map(img => ({
          id: img.id,
          title: img.title,
          subtitle: img.subtitle,
          url: img.url,
        }))}
        onRemoveItem={(item) => {
          if (item.id) removeIntroImage(item.id);
        }}
        onClearAll={resetToDefaults}
      />

      {/* Edit Text Modal */}
      <EditTextModal
        isOpen={isEditTextOpen}
        onClose={() => setIsEditTextOpen(false)}
        title="Edit Company Introduction Copy"
        subtitle="Narrative & Quotations"
        fields={[
          {
            key: 'body1',
            label: 'Main Quote Statement (Body 1)',
            value: company.description.body1,
            multiline: true,
            rows: 3,
          },
          {
            key: 'body2',
            label: 'Production Overview Paragraph (Body 2)',
            value: company.description.body2,
            multiline: true,
            rows: 3,
          },
          {
            key: 'body3',
            label: 'Commitment to Excellence Paragraph (Body 3)',
            value: company.description.body3,
            multiline: true,
            rows: 3,
          },
        ]}
        onSave={handleSaveText}
      />
    </section>
  );
};

