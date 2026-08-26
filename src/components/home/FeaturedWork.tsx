import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import { ProjectDetailModal } from '../ui/ProjectDetailModal';
import { useContent } from '../../context/ContentContext';
import { SectionEditorBar } from '../editor/SectionEditorBar';
import { AddImageModal } from '../editor/AddImageModal';
import { EditTextModal } from '../editor/EditTextModal';
import type { ProjectItem } from '../../types';

interface FeaturedWorkProps {
  onOpenQuoteModal?: () => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onOpenQuoteModal }) => {
  const { projects, addProject, removeProject } = useContent();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [isEditTextOpen, setIsEditTextOpen] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [sectionHeading, setSectionHeading] = useState({
    title: 'FEATURED WORK & EXHIBITS.',
    subtitle: 'Explore high-impact branding, events, lightboxes, and packaging executed across Qatar.',
  });

  const displayedProjects = showAll ? projects : projects.filter(p => p.featured).slice(0, 6);

  const handleAddProject = (data: { url: string; title: string; subtitle?: string; caption?: string; description?: string }) => {
    addProject({
      title: data.title,
      category: data.subtitle || 'Signage & Fabrication',
      serviceSlug: 'signage-fabrication',
      client: 'Doha Client',
      year: '2026',
      coverImage: data.url,
      summary: data.caption || data.description || 'Custom print and fabrication installation executed with precision in Qatar.',
      description: data.description || data.caption || 'Detailed execution overview for Qatar projects.',
      scope: ['Precision Printing', 'Installation & Finishing'],
      gallery: [{ url: data.url, title: data.title, caption: data.caption || 'Project Showcase' }],
      featured: true,
    });
  };

  return (
    <section id="work" className="relative py-28 md:py-36 bg-[#FFFFFF] border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with exact Pill Action Buttons as shown in user screenshots */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            number="03"
            tag="AUTHENTIC PORTFOLIO"
            title={sectionHeading.title}
            subtitle={sectionHeading.subtitle}
          />

          <div className="flex flex-wrap items-center gap-3">
            <SectionEditorBar
              addImageLabel="Add Gallery Item"
              clearDataLabel="Clear Added Data"
              onAddImage={() => setIsAddProjectOpen(true)}
              onClearData={() => {
                if (window.confirm('Reset portfolio items to default?')) {
                  // Handled via context
                }
              }}
            />

            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{showAll ? 'Featured Only' : `View All (${projects.length})`}</span>
            </button>
          </div>
        </div>

        {/* 2x2 / 3x2 Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {displayedProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              aspectRatio="wide"
              priority={idx < 2}
              onClick={() => setSelectedProject(project)}
              onRemove={() => removeProject(project.id)}
            />
          ))}
        </div>

        {displayedProjects.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50">
            <p className="font-mono text-sm text-gray-500 mb-3">No projects currently listed.</p>
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-mono text-xs uppercase font-bold"
            >
              + Add Project
            </button>
          </div>
        )}
      </div>

      {/* In-Place Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenQuoteModal={onOpenQuoteModal}
      />

      {/* Add Project Modal */}
      <AddImageModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Add New Project to Portfolio"
        subtitle="Portfolio Item"
        requireDescription={true}
        onAdd={handleAddProject}
      />

      {/* Edit Header Text Modal */}
      <EditTextModal
        isOpen={isEditTextOpen}
        onClose={() => setIsEditTextOpen(false)}
        title="Edit Section Heading"
        subtitle="Featured Work Header"
        fields={[
          {
            key: 'title',
            label: 'Section Title',
            value: sectionHeading.title,
          },
          {
            key: 'subtitle',
            label: 'Section Subtitle',
            value: sectionHeading.subtitle,
            multiline: true,
            rows: 2,
          },
        ]}
        onSave={(values) => {
          setSectionHeading({
            title: values.title || sectionHeading.title,
            subtitle: values.subtitle || sectionHeading.subtitle,
          });
        }}
      />
    </section>
  );
};


