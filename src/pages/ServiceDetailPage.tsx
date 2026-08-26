import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Cpu, Compass } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionEditorBar } from '../components/editor/SectionEditorBar';
import { AddImageModal } from '../components/editor/AddImageModal';
import { EditTextModal } from '../components/editor/EditTextModal';
import { RemoveItemModal } from '../components/editor/RemoveItemModal';

interface ServiceDetailPageProps {
  onOpenQuoteModal: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { services, updateService, addServiceGalleryImage, removeServiceGalleryImage, resetToDefaults } = useContent();
  
  const [isAddHeroImageOpen, setIsAddHeroImageOpen] = useState<boolean>(false);
  const [isEditHeroTextOpen, setIsEditHeroTextOpen] = useState<boolean>(false);
  const [isAddGalleryImageOpen, setIsAddGalleryImageOpen] = useState<boolean>(false);
  const [isRemoveGalleryOpen, setIsRemoveGalleryOpen] = useState<boolean>(false);

  const service = services.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const handleSaveHeroText = (values: Record<string, string>) => {
    updateService(service.slug, {
      title: values.title || service.title,
      subtitle: values.subtitle || service.subtitle,
      fullDescription: values.fullDescription || service.fullDescription,
    });
  };

  const handleSaveHeroImage = (data: { url: string }) => {
    updateService(service.slug, {
      heroImage: data.url,
    });
  };

  const handleAddGalleryImage = (data: { url: string; title: string; caption?: string; description?: string }) => {
    addServiceGalleryImage(service.slug, {
      url: data.url,
      title: data.title,
      caption: data.caption || data.description || 'Authentic Delivered Exhibit',
    });
  };

  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview ({services.length} Pillars)</span>
        </Link>
      </div>

      {/* Hero Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-gray-200">
        {/* Section Management Header Bar for Hero */}
        <SectionEditorBar
          sectionName={`${service.title} / Overview & Hero`}
          addImageLabel="Change Hero Image"
          editTextLabel="Edit Description & Title"
          onAddImage={() => setIsAddHeroImageOpen(true)}
          onEditText={() => setIsEditHeroTextOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#008BA3] px-3 py-1 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25">
                Pillar {service.number}
              </span>
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Specialized Production
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#0A0B0D] tracking-tight uppercase leading-[1.02]">
              {service.title}
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-[#008BA3] leading-snug">
              “{service.subtitle}”
            </p>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {service.fullDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenQuoteModal}
                className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer"
              >
                <span>Request {service.title} Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/97477889257?text=Hello%20FACE%20PRINTING%20SERVICES,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono text-xs uppercase tracking-wider border border-gray-200 transition-all font-medium"
              >
                Direct WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200 shadow-2xl group">
              <img
                src={service.heroImage}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Materials 3-Column Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-gray-200 bg-[#F8FAFC]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Key Deliverables */}
          <div className="p-8 rounded-3xl bg-white border border-gray-200 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900">Key Deliverables</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Substrates & Materials */}
          <div className="p-8 rounded-3xl bg-white border border-gray-200 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900">Substrates & Specs</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.materials.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Applications */}
          <div className="p-8 rounded-3xl bg-white border border-gray-200 flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#00BCD4]/10 border border-[#00BCD4]/30 flex items-center justify-center text-[#008BA3]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900">Applications in Qatar</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            number={service.number}
            tag="AUTHENTIC GALLERY"
            title={`${service.title} EXHIBITS.`}
            subtitle="Genuine project deliverables executed for organizations across Qatar."
          />

          <SectionEditorBar
            addImageLabel="Add Gallery Item"
            clearDataLabel="Clear Added Data"
            onAddImage={() => setIsAddGalleryImageOpen(true)}
            onClearData={() => setIsRemoveGalleryOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.gallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:border-[#00BCD4]/40 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col">
                <h4 className="font-display font-bold text-sm text-gray-900 truncate">
                  {item.title}
                </h4>
                <p className="font-mono text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {service.gallery.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-sm text-gray-500">No exhibits currently in this gallery.</p>
            <button
              onClick={() => setIsAddGalleryImageOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-mono text-xs uppercase font-bold"
            >
              + Add First Exhibit Image & Description
            </button>
          </div>
        )}
      </section>

      {/* Hero Image Modal */}
      <AddImageModal
        isOpen={isAddHeroImageOpen}
        onClose={() => setIsAddHeroImageOpen(false)}
        title={`Change Hero Image for ${service.title}`}
        subtitle="Hero Artwork"
        onAdd={handleSaveHeroImage}
      />

      {/* Hero Text Modal */}
      <EditTextModal
        isOpen={isEditHeroTextOpen}
        onClose={() => setIsEditHeroTextOpen(false)}
        title={`Edit ${service.title} Overview`}
        subtitle="Hero Details"
        fields={[
          {
            key: 'title',
            label: 'Service Title',
            value: service.title,
          },
          {
            key: 'subtitle',
            label: 'Subtitle Quote',
            value: service.subtitle,
          },
          {
            key: 'fullDescription',
            label: 'Full Detailed Description',
            value: service.fullDescription,
            multiline: true,
            rows: 4,
          },
        ]}
        onSave={handleSaveHeroText}
      />

      {/* Gallery Image & Description Modal */}
      <AddImageModal
        isOpen={isAddGalleryImageOpen}
        onClose={() => setIsAddGalleryImageOpen(false)}
        title={`Add Exhibit to ${service.title}`}
        subtitle="Authentic Gallery"
        requireDescription={true}
        onAdd={handleAddGalleryImage}
      />

      {/* Remove Gallery Items Modal */}
      <RemoveItemModal
        isOpen={isRemoveGalleryOpen}
        onClose={() => setIsRemoveGalleryOpen(false)}
        title={`Remove Exhibits from ${service.title}`}
        subtitle="Manage Gallery Exhibits"
        items={service.gallery.map((g, idx) => ({
          index: idx,
          title: g.title,
          subtitle: g.caption,
          url: g.url,
        }))}
        onRemoveItem={(_, idx) => {
          removeServiceGalleryImage(service.slug, idx);
        }}
        onClearAll={resetToDefaults}
      />
    </div>
  );
};

