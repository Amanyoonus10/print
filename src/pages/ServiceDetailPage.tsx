import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Cpu, Compass, Edit3 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { servicesData } from '../data/services';
import { SectionEditorBar } from '../components/editor/SectionEditorBar';
import { AddImageModal } from '../components/editor/AddImageModal';
import { EditTextModal } from '../components/editor/EditTextModal';
import { RemoveItemModal } from '../components/editor/RemoveItemModal';
import { MediaRenderer } from '../components/ui/MediaRenderer';

interface ServiceDetailPageProps {
  onOpenQuoteModal: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { services, updateService, addServiceGalleryImage, removeServiceGalleryImage, resetToDefaults } = useContent();
  
  const [isAddHeroImageOpen, setIsAddHeroImageOpen] = useState<boolean>(false);
  const [heroModalMediaType, setHeroModalMediaType] = useState<'image' | 'video'>('image');
  const [isEditHeroTextOpen, setIsEditHeroTextOpen] = useState<boolean>(false);
  const [isAddGalleryImageOpen, setIsAddGalleryImageOpen] = useState<boolean>(false);
  const [galleryModalMediaType, setGalleryModalMediaType] = useState<'image' | 'video'>('image');
  const [isRemoveGalleryOpen, setIsRemoveGalleryOpen] = useState<boolean>(false);
  const [isEditGalleryTextOpen, setIsEditGalleryTextOpen] = useState<boolean>(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

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

  const handleSaveHeroImage = (data: { url: string; mediaType?: 'image' | 'video' }) => {
    updateService(service.slug, {
      heroImage: data.url,
      heroMediaType: data.mediaType,
    });
  };

  const handleAddGalleryImage = (data: { url: string; title: string; caption?: string; description?: string; mediaType?: 'image' | 'video' }) => {
    addServiceGalleryImage(service.slug, {
      url: data.url,
      title: data.title,
      caption: data.caption || data.description || 'Authentic Delivered Exhibit',
      mediaType: data.mediaType,
    });
  };

  const handleSaveGalleryText = (values: Record<string, string>) => {
    updateService(service.slug, {
      galleryTitle: values.galleryTitle || `${service.title} EXHIBITS.`,
      gallerySubtitle: values.gallerySubtitle || 'Genuine project deliverables executed for organizations across Qatar.',
      galleryTag: values.galleryTag || 'AUTHENTIC GALLERY',
    });
  };

  const handleSaveItemText = (values: Record<string, string>) => {
    if (editingItemIndex === null) return;
    const newGallery = [...service.gallery];
    if (newGallery[editingItemIndex]) {
      newGallery[editingItemIndex] = {
        ...newGallery[editingItemIndex],
        title: values.title || newGallery[editingItemIndex].title,
        caption: values.caption || newGallery[editingItemIndex].caption,
      };
      updateService(service.slug, { gallery: newGallery });
    }
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

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#EDE8DE]">
        <SectionEditorBar
          className="mb-8 justify-end"
          addImageLabel="Change Hero Image"
          addVideoLabel="Add / Change Hero Video"
          editTextLabel="Edit Description & Title"
          clearDataLabel="Restore Original Image"
          onAddImage={() => {
            setHeroModalMediaType('image');
            setIsAddHeroImageOpen(true);
          }}
          onAddVideo={() => {
            setHeroModalMediaType('video');
            setIsAddHeroImageOpen(true);
          }}
          onEditText={() => setIsEditHeroTextOpen(true)}
          onClearData={() => {
            const defaultService = servicesData.find((init) => init.slug === service.slug);
            if (defaultService) {
              updateService(service.slug, {
                heroImage: defaultService.heroImage,
                heroMediaType: 'image',
              });
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#49C1DA] px-3 py-1 rounded-full bg-[#49C1DA]/10 border border-[#49C1DA]/25">
                Pillar {service.number}
              </span>
              <span className="font-mono text-xs text-[#B8955A] uppercase tracking-widest font-bold">
                Specialized Production
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#171717] tracking-tight uppercase leading-[1.02]">
              {service.title}
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-[#49C1DA] leading-snug">
              “{service.subtitle}”
            </p>

            <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
              {service.fullDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenQuoteModal}
                className="px-8 py-4 rounded-full bg-[#49C1DA] hover:bg-[#32AEC8] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(73,193,218,0.3)] cursor-pointer hover:scale-105"
              >
                <span>Request {service.title} Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/97433635098?text=Hello%20FACE%20PRINTING%20SERVICES,%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-full bg-white hover:bg-[#EDE8DE] text-[#171717] font-mono text-xs uppercase tracking-wider border border-[#EDE8DE] transition-all font-semibold shadow-xs"
              >
                Direct WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-white border border-[#EDE8DE] shadow-2xl group">
              <MediaRenderer
                src={service.heroImage}
                mediaType={service.heroMediaType}
                alt={service.title}
                showMutedIndicator={true}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Materials 3-Column Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-[#EDE8DE] bg-[#EDE8DE]/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Key Deliverables */}
          <div className="p-8 rounded-3xl bg-white border border-[#EDE8DE] flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#49C1DA]/10 border border-[#49C1DA]/25 flex items-center justify-center text-[#49C1DA]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#171717]">Key Deliverables</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Substrates & Materials */}
          <div className="p-8 rounded-3xl bg-white border border-[#EDE8DE] flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#49C1DA]/10 border border-[#49C1DA]/25 flex items-center justify-center text-[#49C1DA]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#171717]">Substrates & Specs</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.materials.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Applications */}
          <div className="p-8 rounded-3xl bg-white border border-[#EDE8DE] flex flex-col gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#49C1DA]/10 border border-[#49C1DA]/25 flex items-center justify-center text-[#49C1DA]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#171717]">Applications in Qatar</h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {service.applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0 mt-0.5" />
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
            tag={service.galleryTag || "AUTHENTIC GALLERY"}
            title={service.galleryTitle || `${service.title} EXHIBITS.`}
            subtitle={service.gallerySubtitle || "Genuine project deliverables executed for organizations across Qatar."}
          />

          <SectionEditorBar
            addImageLabel="Add Gallery Image"
            addVideoLabel="Add Gallery Video"
            editTextLabel="Edit Gallery Title & Description"
            clearDataLabel="Clear Added Data"
            onAddImage={() => {
              setGalleryModalMediaType('image');
              setIsAddGalleryImageOpen(true);
            }}
            onAddVideo={() => {
              setGalleryModalMediaType('video');
              setIsAddGalleryImageOpen(true);
            }}
            onEditText={() => setIsEditGalleryTextOpen(true)}
            onClearData={() => setIsRemoveGalleryOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.gallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-[#EDE8DE] overflow-hidden shadow-xs hover:border-[#B8955A]/60 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                <MediaRenderer
                  src={item.url}
                  mediaType={item.mediaType}
                  alt={item.title}
                  priority={idx < 3}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-bold text-sm text-[#171717] line-clamp-1">
                      {item.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingItemIndex(idx)}
                      title={`Edit ${item.title}`}
                      className="p-1 rounded-md text-gray-400 hover:text-[#49C1DA] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-mono text-xs text-[#777777] mt-1 line-clamp-2">
                    {item.caption || 'Project deliverable executed with precision in Doha, Qatar.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {service.gallery.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-[#EDE8DE] rounded-3xl bg-white flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-sm text-[#555555]">No exhibits currently in this gallery.</p>
            <button
              onClick={() => setIsAddGalleryImageOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#49C1DA] text-white font-mono text-xs uppercase font-bold cursor-pointer"
            >
              + Add First Exhibit Image & Description
            </button>
          </div>
        )}
      </section>

      {/* Hero Media Modal (Photo or Video - No Sound) */}
      <AddImageModal
        isOpen={isAddHeroImageOpen}
        onClose={() => setIsAddHeroImageOpen(false)}
        title={`Change Hero Media for ${service.title}`}
        subtitle="Hero Artwork / Silent Video"
        initialMediaType={heroModalMediaType}
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

      {/* Gallery Media Modal (Photo or Video - No Sound) */}
      <AddImageModal
        isOpen={isAddGalleryImageOpen}
        onClose={() => setIsAddGalleryImageOpen(false)}
        title={`Add Exhibit to ${service.title}`}
        subtitle="Authentic Gallery (Photo or Video)"
        initialMediaType={galleryModalMediaType}
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

      {/* Edit Gallery Header Text Modal */}
      <EditTextModal
        isOpen={isEditGalleryTextOpen}
        onClose={() => setIsEditGalleryTextOpen(false)}
        title={`Edit ${service.title} Gallery Header`}
        subtitle="Customize the section title and description"
        fields={[
          {
            key: 'galleryTitle',
            label: 'Section Title',
            value: service.galleryTitle || `${service.title} EXHIBITS.`,
          },
          {
            key: 'gallerySubtitle',
            label: 'Section Subtitle',
            value: service.gallerySubtitle || 'Genuine project deliverables executed for organizations across Qatar.',
            multiline: true,
            rows: 2,
          },
          {
            key: 'galleryTag',
            label: 'Category Tag',
            value: service.galleryTag || 'AUTHENTIC GALLERY',
          },
        ]}
        onSave={handleSaveGalleryText}
      />

      {/* Edit Individual Gallery Item Modal */}
      {editingItemIndex !== null && service.gallery[editingItemIndex] && (
        <EditTextModal
          isOpen={editingItemIndex !== null}
          onClose={() => setEditingItemIndex(null)}
          title={`Edit Exhibit: ${service.gallery[editingItemIndex].title}`}
          subtitle="Update exhibit title and caption"
          fields={[
            {
              key: 'title',
              label: 'Exhibit Title',
              value: service.gallery[editingItemIndex].title,
            },
            {
              key: 'caption',
              label: 'Exhibit Caption',
              value: service.gallery[editingItemIndex].caption,
              multiline: true,
              rows: 3,
            },
          ]}
          onSave={handleSaveItemText}
        />
      )}
    </div>
  );
};

