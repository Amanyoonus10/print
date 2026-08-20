import React, { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectCard } from '../components/ui/ProjectCard';
import { projectsData } from '../data/projects';

interface WorkPageProps {
  onOpenQuoteModal: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <div className="w-full pt-32 pb-24 bg-[#FFFFFF] overflow-hidden">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 border-b border-gray-200">
        <SectionHeading
          number="03"
          tag="CASE STUDIES & EXHIBITS"
          title="SELECTED PORTFOLIO."
          subtitle="Explore authentic visual productions, sports arena hoardings, illuminated systems, and corporate deliverables in Qatar."
        />

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
      </section>
    </div>
  );
};
