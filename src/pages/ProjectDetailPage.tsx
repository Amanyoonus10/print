import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Calendar, Building2, Tag, Edit3 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionEditorBar } from '../components/editor/SectionEditorBar';
import { AddImageModal } from '../components/editor/AddImageModal';
import { EditTextModal } from '../components/editor/EditTextModal';
import { RemoveItemModal } from '../components/editor/RemoveItemModal';
import { MediaRenderer } from '../components/ui/MediaRenderer';

interface ProjectDetailPageProps {
  onOpenQuoteModal: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, updateProject, addProjectGalleryImage, removeProjectGalleryImage, resetToDefaults } = useContent();

  const [isAddCoverImageOpen, setIsAddCoverImageOpen] = useState<boolean>(false);
  const [coverModalMediaType, setCoverModalMediaType] = useState<'image' | 'video'>('image');
  const [isEditTextOpen, setIsEditTextOpen] = useState<boolean>(false);
  const [isAddGalleryImageOpen, setIsAddGalleryImageOpen] = useState<boolean>(false);
  const [galleryModalMediaType, setGalleryModalMediaType] = useState<'image' | 'video'>('image');
  const [isRemoveGalleryOpen, setIsRemoveGalleryOpen] = useState<boolean>(false);
  const [isEditGalleryTextOpen, setIsEditGalleryTextOpen] = useState<boolean>(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const handleSaveText = (values: Record<string, string>) => {
    updateProject(project.id, {
      title: values.title || project.title,
      category: values.category || project.category,
      client: values.client || project.client,
      description: values.description || project.description,
      challenge: values.challenge || project.challenge,
      solution: values.solution || project.solution,
    });
  };

  const handleSaveCoverImage = (data: { url: string; mediaType?: 'image' | 'video' }) => {
    updateProject(project.id, {
      coverImage: data.url,
      coverMediaType: data.mediaType,
    });
  };

  const handleAddGalleryImage = (data: { url: string; title: string; caption?: string; description?: string; mediaType?: 'image' | 'video' }) => {
    addProjectGalleryImage(project.id, {
      url: data.url,
      title: data.title,
      caption: data.caption || data.description || 'Authentic Delivered Solution',
      mediaType: data.mediaType,
    });
  };

  const handleSaveGalleryText = (values: Record<string, string>) => {
    updateProject(project.id, {
      galleryTitle: values.galleryTitle || 'PROJECT GALLERIES.',
      gallerySubtitle: values.gallerySubtitle || 'Authentic visual captures of delivered solutions in Qatar.',
      galleryTag: values.galleryTag || 'PHOTO EXHIBITS',
    });
  };

  const handleSaveItemText = (values: Record<string, string>) => {
    if (editingItemIndex === null) return;
    const newGallery = [...project.gallery];
    if (newGallery[editingItemIndex]) {
      newGallery[editingItemIndex] = {
        ...newGallery[editingItemIndex],
        title: values.title || newGallery[editingItemIndex].title,
        caption: values.caption || newGallery[editingItemIndex].caption,
      };
      updateProject(project.id, { gallery: newGallery });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F4EE] pt-28 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#49C1DA] hover:text-[#B8955A] uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Authentic Portfolio</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#EDE8DE]">
        <SectionEditorBar
          className="mb-8 justify-end"
          addImageLabel="Change Cover Image"
          addVideoLabel="Add / Change Cover Video"
          editTextLabel="Edit Case Study Copy"
          onAddImage={() => {
            setCoverModalMediaType('image');
            setIsAddCoverImageOpen(true);
          }}
          onAddVideo={() => {
            setCoverModalMediaType('video');
            setIsAddCoverImageOpen(true);
          }}
          onEditText={() => setIsEditTextOpen(true)}
        />

        <div className="max-w-4xl flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#49C1DA] px-3 py-1.5 rounded-full bg-[#49C1DA]/10 border border-[#49C1DA]/25">
              {project.category}
            </span>
            <span className="font-mono text-xs text-[#B8955A] bg-white px-3 py-1.5 rounded-full border border-[#EDE8DE] font-bold">
              Year {project.year}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#171717] tracking-tight uppercase leading-[1.05]">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#555555] font-medium leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 p-6 rounded-2xl bg-white border border-[#EDE8DE] shadow-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#B8955A] uppercase flex items-center gap-1.5 font-bold">
              <Building2 className="w-3.5 h-3.5 text-[#49C1DA]" />
              Client
            </span>
            <span className="text-sm font-display font-bold text-[#171717] mt-1">{project.client}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#B8955A] uppercase flex items-center gap-1.5 font-bold">
              <Tag className="w-3.5 h-3.5 text-[#49C1DA]" />
              Discipline
            </span>
            <span className="text-sm font-display font-bold text-[#171717] mt-1">{project.category}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#B8955A] uppercase flex items-center gap-1.5 font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#49C1DA]" />
              Completed
            </span>
            <span className="text-sm font-display font-bold text-[#171717] mt-1">{project.year}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#B8955A] uppercase font-bold">Location</span>
            <span className="text-sm font-display font-bold text-[#171717] mt-1">Doha, Qatar</span>
          </div>
        </div>
      </section>

      {/* Main Cover Image / Video */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-white border border-[#EDE8DE] shadow-2xl">
          <MediaRenderer
            src={project.coverImage}
            mediaType={project.coverMediaType}
            alt={project.title}
            showMutedIndicator={true}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Challenge & Solution Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[#EDE8DE]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#EDE8DE] flex flex-col gap-3 shadow-xs">
            <span className="font-mono text-xs text-[#49C1DA] uppercase tracking-widest font-bold">
              The Engineering Challenge
            </span>
            <h3 className="font-display font-bold text-2xl text-[#171717]">Demanding Deadlines & Precision</h3>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EDE8DE] flex flex-col gap-3 shadow-xs">
            <span className="font-mono text-xs text-[#49C1DA] uppercase tracking-widest font-bold">
              Our Technical Solution
            </span>
            <h3 className="font-display font-bold text-2xl text-[#171717]">Flawless Material Execution</h3>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="mt-8 p-8 rounded-3xl bg-white border border-[#EDE8DE] shadow-xs">
          <h4 className="font-display font-bold text-xl text-[#171717] mb-4">Delivered Deliverables & Scope:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {project.scope.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8955A] shrink-0" />
                <span className="text-xs sm:text-sm font-mono text-[#555555] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <SectionHeading
            tag={project.galleryTag || "PHOTO EXHIBITS"}
            title={project.galleryTitle || "PROJECT GALLERIES."}
            subtitle={project.gallerySubtitle || "Authentic visual captures of delivered solutions in Qatar."}
          />

          <SectionEditorBar
            addImageLabel="Add Gallery Image"
            addVideoLabel="Add Gallery Video"
            editTextLabel="Edit Gallery Title & Subtitle"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-white border border-[#EDE8DE] overflow-hidden shadow-xs hover:border-[#B8955A]/60 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[16/10] bg-[#F7F4EE] overflow-hidden">
                <MediaRenderer
                  src={item.url}
                  mediaType={item.mediaType}
                  alt={item.title}
                  priority={idx < 2}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col gap-1 justify-between flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-bold text-lg text-[#171717]">{item.title}</h4>
                    <button
                      type="button"
                      onClick={() => setEditingItemIndex(idx)}
                      title={`Edit ${item.title}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#49C1DA] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#777777] font-mono mt-1">{item.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {project.gallery.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-[#EDE8DE] rounded-3xl bg-white flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-sm text-[#555555]">No photos currently in this gallery.</p>
            <button
              onClick={() => setIsAddGalleryImageOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#49C1DA] text-white font-mono text-xs uppercase font-bold cursor-pointer"
            >
              + Add First Photo Exhibit
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={onOpenQuoteModal}
            className="px-8 py-4 rounded-full bg-[#49C1DA] hover:bg-[#32AEC8] text-white font-display font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(73,193,218,0.35)] cursor-pointer hover:scale-105 transition-all"
          >
            <span>Inquire About Similar Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Cover Media Modal (Photo or Video - No Sound) */}
      <AddImageModal
        isOpen={isAddCoverImageOpen}
        onClose={() => setIsAddCoverImageOpen(false)}
        title={`Change Cover Media for ${project.title}`}
        subtitle="Cover Photo / Silent Video"
        initialMediaType={coverModalMediaType}
        onAdd={handleSaveCoverImage}
      />

      {/* Edit Text Modal */}
      <EditTextModal
        isOpen={isEditTextOpen}
        onClose={() => setIsEditTextOpen(false)}
        title={`Edit ${project.title}`}
        subtitle="Case Study Details"
        fields={[
          {
            key: 'title',
            label: 'Project Title',
            value: project.title,
          },
          {
            key: 'client',
            label: 'Client Name',
            value: project.client,
          },
          {
            key: 'category',
            label: 'Discipline / Category',
            value: project.category,
          },
          {
            key: 'description',
            label: 'Project Overview Description',
            value: project.description,
            multiline: true,
            rows: 3,
          },
          {
            key: 'challenge',
            label: 'Engineering Challenge',
            value: project.challenge || '',
            multiline: true,
            rows: 2,
          },
          {
            key: 'solution',
            label: 'Technical Solution',
            value: project.solution || '',
            multiline: true,
            rows: 2,
          },
        ]}
        onSave={handleSaveText}
      />

      {/* Add Gallery Media Modal (Photo or Video - No Sound) */}
      <AddImageModal
        isOpen={isAddGalleryImageOpen}
        onClose={() => setIsAddGalleryImageOpen(false)}
        title={`Add Exhibit to ${project.title}`}
        subtitle="Media Exhibits (Photo or Video)"
        initialMediaType={galleryModalMediaType}
        requireDescription={true}
        onAdd={handleAddGalleryImage}
      />

      {/* Remove Gallery Images Modal */}
      <RemoveItemModal
        isOpen={isRemoveGalleryOpen}
        onClose={() => setIsRemoveGalleryOpen(false)}
        title={`Remove Photos from ${project.title}`}
        subtitle="Manage Project Gallery"
        items={project.gallery.map((g, idx) => ({
          index: idx,
          title: g.title,
          subtitle: g.caption,
          url: g.url,
        }))}
        onRemoveItem={(_, idx) => {
          removeProjectGalleryImage(project.id, idx);
        }}
        onClearAll={resetToDefaults}
      />

      {/* Edit Gallery Header Text Modal */}
      <EditTextModal
        isOpen={isEditGalleryTextOpen}
        onClose={() => setIsEditGalleryTextOpen(false)}
        title={`Edit ${project.title} Gallery Header`}
        subtitle="Customize the project gallery section title and description"
        fields={[
          {
            key: 'galleryTitle',
            label: 'Section Title',
            value: project.galleryTitle || 'PROJECT GALLERIES.',
          },
          {
            key: 'gallerySubtitle',
            label: 'Section Subtitle',
            value: project.gallerySubtitle || 'Authentic visual captures of delivered solutions in Qatar.',
            multiline: true,
            rows: 2,
          },
          {
            key: 'galleryTag',
            label: 'Category Tag',
            value: project.galleryTag || 'PHOTO EXHIBITS',
          },
        ]}
        onSave={handleSaveGalleryText}
      />

      {/* Edit Individual Gallery Item Modal */}
      {editingItemIndex !== null && project.gallery[editingItemIndex] && (
        <EditTextModal
          isOpen={editingItemIndex !== null}
          onClose={() => setEditingItemIndex(null)}
          title={`Edit Exhibit: ${project.gallery[editingItemIndex].title}`}
          subtitle="Update exhibit title and caption"
          fields={[
            {
              key: 'title',
              label: 'Exhibit Title',
              value: project.gallery[editingItemIndex].title,
            },
            {
              key: 'caption',
              label: 'Exhibit Caption',
              value: project.gallery[editingItemIndex].caption,
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
