import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import { projectsData } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedWork: React.FC = () => {
  const featuredProjects = projectsData.filter(p => p.featured).slice(0, 4);

  return (
    <section className="relative py-28 md:py-36 bg-[#FFFFFF] border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            number="03"
            tag="AUTHENTIC PORTFOLIO"
            title="FEATURED WORK & EXHIBITS."
            subtitle="Explore high-impact branding, events, lightboxes, and packaging executed across Qatar."
          />

          <Link
            to="/work"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#008BA3] hover:text-[#00BCD4] font-bold uppercase tracking-widest self-start md:self-end pb-2 group"
          >
            <span>View Full Portfolio</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* 2x2 Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featuredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              aspectRatio="wide"
              priority={idx < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
