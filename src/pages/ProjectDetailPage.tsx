import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Calendar, Building2, Tag } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionEditorBar } from '../components/editor/SectionEditorBar';
import { AddImageModal } from '../components/editor/AddImageModal';
import { EditTextModal } from '../components/editor/EditTextModal';

interface ProjectDetailPageProps {
  onOpenQuoteModal: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, updateProject, addProjectGalleryImage } = useContent();

  const [isAddCoverImageOpen, setIsAddCoverImageOpen] = useState<boolean>(false);
  const [isEditTextOpen, setIsEditTextOpen] = useState<boolean>(false);
  const [isAddGalleryImageOpen, setIsAddGalleryImageOpen] = useState<boolean>(false);

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

  const handleSaveCoverImage = (data: { url: string }) => {
    updateProject(project.id, {
      coverImage: data.url,
    });
  };

  const handleAddGalleryImage = (data: { url: string; title: string; caption?: string; description?: string }) => {
    addProjectGalleryImage(project.id, {
      url: data.url,
      title: data.title,
      caption: data.caption || data.description || 'Authentic Delivered Solution',
    });
  };

  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Case Studies</span>
        </Link>
      </div>

      {/* Case Study Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-200">
        {/* Section Management Header Bar */}
        <SectionEditorBar
          sectionName={`${project.title} / Case Study`}
          addImageLabel="Change Cover Image"
          editTextLabel="Edit Case Study Copy"
          onAddImage={() => setIsAddCoverImageOpen(true)}
          onEditText={() => setIsEditTextOpen(true)}
        />

        <div className="max-w-4xl flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#008BA3] px-3 py-1.5 rounded-full bg-[#00BCD4]/10 border border-[#00BCD4]/25">
              {project.category}
            </span>
            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              Year {project.year}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#0A0B0D] tracking-tight uppercase leading-[1.05]">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 p-6 rounded-2xl bg-[#F8FAFC] border border-gray-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#00BCD4]" />
              Client
            </span>
            <span className="text-sm font-display font-bold text-gray-900 mt-1">{project.client}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#00BCD4]" />
              Discipline
            </span>
            <span className="text-sm font-display font-bold text-gray-900 mt-1">{project.category}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00BCD4]" />
              Completed
            </span>
            <span className="text-sm font-display font-bold text-gray-900 mt-1">{project.year}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Location</span>
            <span className="text-sm font-display font-bold text-gray-900 mt-1">Doha, Qatar</span>
          </div>
        </div>
      </section>

      {/* Main Cover Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-gray-100 border border-gray-200 shadow-2xl">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Challenge & Solution Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-gray-200 flex flex-col gap-3">
            <span className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-bold">
              The Engineering Challenge
            </span>
            <h3 className="font-display font-bold text-2xl text-gray-900">Demanding Deadlines & Precision</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-gray-200 flex flex-col gap-3">
            <span className="font-mono text-xs text-[#008BA3] uppercase tracking-widest font-bold">
              Our Technical Solution
            </span>
            <h3 className="font-display font-bold text-2xl text-gray-900">Flawless Material Execution</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="mt-8 p-8 rounded-3xl bg-white border border-gray-200">
          <h4 className="font-display font-bold text-xl text-gray-900 mb-4">Delivered Deliverables & Scope:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {project.scope.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00BCD4] shrink-0" />
                <span className="text-xs sm:text-sm font-mono text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <SectionHeading
            tag="PHOTO EXHIBITS"
            title="PROJECT GALLERIES."
            subtitle="Authentic visual captures of delivered solutions in Qatar."
          />

          <SectionEditorBar
            addImageLabel="Add Gallery Item"
            clearDataLabel="Clear Added Data"
            onAddImage={() => setIsAddGalleryImageOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:border-[#00BCD4]/50 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col gap-1">
                <h4 className="font-display font-bold text-lg text-gray-900">{item.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500 font-mono">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {project.gallery.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-sm text-gray-500">No photos currently in this gallery.</p>
            <button
              onClick={() => setIsAddGalleryImageOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-mono text-xs uppercase font-bold"
            >
              + Add First Photo Exhibit
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={onOpenQuoteModal}
            className="px-8 py-4 rounded-full bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0B0D] font-display font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(0,188,212,0.35)] cursor-pointer"
          >
            <span>Inquire About Similar Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Cover Image Modal */}
      <AddImageModal
        isOpen={isAddCoverImageOpen}
        onClose={() => setIsAddCoverImageOpen(false)}
        title={`Change Cover Image for ${project.title}`}
        subtitle="Cover Photo"
        onAdd={handleSaveCoverImage}
      />

      {/* Edit Text Modal */}
      <EditTextModal
        isOpen={isEditTextOpen}
        onClose={() => setIsEditTextOpen(false)}
        title={`Edit ${project.title}`}
        subtitle="Project Narrative & Specs"
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

      {/* Add Gallery Image Modal */}
      <AddImageModal
        isOpen={isAddGalleryImageOpen}
        onClose={() => setIsAddGalleryImageOpen(false)}
        title={`Add Photo to ${project.title}`}
        subtitle="Photo Exhibits"
        requireDescription={true}
        onAdd={handleAddGalleryImage}
      />
    </div>
  );
};

