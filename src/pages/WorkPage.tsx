import React, { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/ui/ProjectCard';
import { useContent } from '../context/ContentContext';
import { SectionEditorBar } from '../components/editor/SectionEditorBar';
import { AddImageModal } from '../components/editor/AddImageModal';
import { RemoveItemModal } from '../components/editor/RemoveItemModal';

interface WorkPageProps {
  onOpenQuoteModal: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = () => {
  const { projects, addProject, removeProject, resetToDefaults } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

  const categories = [
    'All',
    'Events & Staging',
    'Branding & Spatial',
    'Light Box & Illumination',
    'Gift Items & Packaging',
    'Vehicle Wrapping',
    'Acrylic Works'
  ];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleAddProject = (data: { url: string; title: string; subtitle?: string; caption?: string; description?: string }) => {
    addProject({
      title: data.title,
      category: data.subtitle || (activeCategory !== 'All' ? activeCategory : 'Branding & Spatial'),
      serviceSlug: 'branding-spatial',
      client: 'Doha Client',
      year: '2026',
      coverImage: data.url,
      summary: data.caption || data.description || 'Custom print and fabrication case study executed in Qatar.',
      description: data.description || data.caption || 'Detailed execution case study for Qatar client.',
      scope: ['Precision Printing', 'Quality Finishing'],
      gallery: [{ url: data.url, title: data.title, caption: data.caption || 'Case Study Photo' }],
      featured: true,
    });
  };

  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 border-b border-gray-200">
        {/* Section Management Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <SectionHeading
            number="03"
            tag="CASE STUDIES & EXHIBITS"
            title="SELECTED PORTFOLIO."
            subtitle="Explore authentic visual productions, sports arena hoardings, illuminated systems, and corporate deliverables in Qatar."
          />

          <SectionEditorBar
            addImageLabel="Add Gallery Item"
            clearDataLabel="Clear Added Data"
            onAddImage={() => setIsAddProjectOpen(true)}
            onClearData={() => setIsRemoveModalOpen(true)}
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00BCD4] text-[#0A0B0D] font-bold shadow-[0_2px_15px_rgba(0,188,212,0.35)]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              aspectRatio="wide"
              priority={idx < 2}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center gap-3">
            <p className="font-mono text-sm text-gray-500">No projects found in category "{activeCategory}".</p>
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#00BCD4] text-[#0A0B0D] font-mono text-xs uppercase font-bold"
            >
              + Add Project to {activeCategory}
            </button>
          </div>
        )}
      </section>

      {/* Add Project Modal */}
      <AddImageModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title="Add New Project Case Study"
        subtitle="Portfolio Showcase"
        requireDescription={true}
        onAdd={handleAddProject}
      />

      {/* Remove Items Modal */}
      <RemoveItemModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Remove Portfolio Case Studies"
        subtitle="Manage Portfolio Exhibits"
        items={projects.map(p => ({
          id: p.id,
          title: p.title,
          subtitle: `${p.category} (${p.year})`,
          url: p.coverImage,
        }))}
        onRemoveItem={(item) => {
          if (item.id) removeProject(item.id);
        }}
        onClearAll={resetToDefaults}
      />
    </div>
  );
};

