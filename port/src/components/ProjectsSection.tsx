import React, { useState } from 'react';
import { LayoutGrid, Youtube, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectItem } from '../types';
import { ProjectCard } from './ProjectCard';
import { INITIAL_PROJECTS } from '../data/projects';

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem, currentImgSrc: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
}) => {
  const [filter, setFilter] = useState<'all' | 'youtube' | 'reel'>('all');

  const youtubeProjects = INITIAL_PROJECTS.filter((p) => p.type === 'youtube');
  const reelProjects = INITIAL_PROJECTS.filter((p) => p.type === 'reel');

  const filteredProjects =
    filter === 'all'
      ? INITIAL_PROJECTS
      : INITIAL_PROJECTS.filter((p) => p.type === filter);

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#1b1a20]"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#412220] border border-[#5e322f]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#c98985]">
                Portfolio
              </span>
            </div>
            <h2
              id="projects-heading"
              className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f3eee8] tracking-tight"
            >
              Selected Work
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="filter-btn-all"
              onClick={() => setFilter('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#412220] border border-[#5e322f] text-white shadow-md shadow-[#412220]/40'
                  : 'bg-[#141418] text-[#9a969f] hover:text-[#f3eee8] border border-[#232228]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All ({INITIAL_PROJECTS.length})</span>
            </button>
            <button
              type="button"
              id="filter-btn-youtube"
              onClick={() => setFilter('youtube')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'youtube'
                  ? 'bg-[#412220] border border-[#5e322f] text-white shadow-md shadow-[#412220]/40'
                  : 'bg-[#141418] text-[#9a969f] hover:text-[#f3eee8] border border-[#232228]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Thumbnails ({youtubeProjects.length})</span>
            </button>
            <button
              type="button"
              id="filter-btn-reels"
              onClick={() => setFilter('reel')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === 'reel'
                  ? 'bg-[#412220] border border-[#5e322f] text-white shadow-md shadow-[#412220]/40'
                  : 'bg-[#141418] text-[#9a969f] hover:text-[#f3eee8] border border-[#232228]'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram Reels ({reelProjects.length})</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Display based on filter */}
        {filter === 'all' ? (
          <div className="space-y-20">
            
            {/* 10 YouTube Thumbnails (16:9) */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e322f]" />
                  <h3 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#f3eee8]">
                    YouTube Thumbnails
                  </h3>
                  <span className="text-xs text-[#7d7983] font-mono">16:9 • 10 Projects</span>
                </div>
              </div>

              {/* 2-column grid on desktop ensures large, high-impact previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                {youtubeProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={onSelectProject}
                  />
                ))}
              </div>
            </div>

            {/* 4 Instagram Reel Thumbnails (9:16) */}
            <div>
              <div className="flex items-center justify-between mb-8 pt-8 border-t border-[#1a1920]">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e322f]" />
                  <h3 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[#f3eee8]">
                    Instagram Reels
                  </h3>
                  <span className="text-xs text-[#7d7983] font-mono">9:16 • 4 Projects</span>
                </div>
              </div>

              {/* 4-column responsive grid maintains pristine vertical 9:16 ratio */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                {reelProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={onSelectProject}
                  />
                ))}
              </div>
            </div>

          </div>
        ) : filter === 'youtube' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {youtubeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {reelProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
