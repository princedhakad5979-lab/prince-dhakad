import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectItem } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { getCustomProjectImage } from '../utils/imageStore';

interface LightboxModalProps {
  project: ProjectItem | null;
  activeSrc: string | null;
  onClose: () => void;
  onNavigate: (nextProject: ProjectItem, nextSrc: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  project,
  activeSrc,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project]);

  if (!project || !activeSrc) return null;

  const currentIndex = INITIAL_PROJECTS.findIndex((p) => p.id === project.id);

  const getSourceForProject = (p: ProjectItem) => {
    return getCustomProjectImage(p.id) || p.defaultSrc;
  };

  const goToNext = () => {
    const nextIdx = (currentIndex + 1) % INITIAL_PROJECTS.length;
    const nextP = INITIAL_PROJECTS[nextIdx];
    onNavigate(nextP, getSourceForProject(nextP));
  };

  const goToPrev = () => {
    const prevIdx =
      (currentIndex - 1 + INITIAL_PROJECTS.length) % INITIAL_PROJECTS.length;
    const prevP = INITIAL_PROJECTS[prevIdx];
    onNavigate(prevP, getSourceForProject(prevP));
  };

  const isReel = project.type === 'reel';

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Container */}
      <div
        id="lightbox-content"
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm text-[#e8dfd8] mb-4 px-2">
          <div className="flex items-center gap-3">
            <span className="font-['Outfit'] font-bold text-[#c98985]">
              Project {project.projectNumber}
            </span>
            <span className="text-[#8e8a94]">•</span>
            <span className="text-[#b8b3ab]">{project.typeLabel}</span>
            <span className="text-[#64626b] font-mono">({project.aspectRatio})</span>
          </div>

          <button
            type="button"
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-[#18181e] hover:bg-[#412220] border border-transparent hover:border-[#5e322f] text-[#f3eee8] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview Frame */}
        <div
          className={`relative rounded-2xl overflow-hidden bg-[#111115] border border-[#282630] shadow-2xl flex items-center justify-center ${
            isReel ? 'max-h-[75vh] aspect-[9/16]' : 'w-full max-h-[75vh] aspect-[16/9]'
          }`}
        >
          <img
            src={activeSrc}
            alt={`${project.typeLabel} ${project.projectNumber}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Navigation buttons */}
        <button
          type="button"
          id="lightbox-prev-btn"
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#16161c]/80 hover:bg-[#412220] text-white border border-white/10 hover:border-[#5e322f] transition-colors"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          id="lightbox-next-btn"
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#16161c]/80 hover:bg-[#412220] text-white border border-white/10 hover:border-[#5e322f] transition-colors"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
