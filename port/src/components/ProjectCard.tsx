import React, { useRef, useState, useEffect } from 'react';
import { Maximize2, Upload, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectItem } from '../types';
import {
  getCustomProjectImage,
  compressAndStoreProjectImage,
  subscribeToImageStore,
} from '../utils/imageStore';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem, currentImgSrc: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [customSrc, setCustomSrc] = useState<string | null>(() => {
    return getCustomProjectImage(project.id);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize state when store updates (e.g. from IndexedDB initial load or modal)
  useEffect(() => {
    const unsubscribe = subscribeToImageStore(() => {
      const stored = getCustomProjectImage(project.id);
      setCustomSrc(stored);
    });
    return unsubscribe;
  }, [project.id]);

  // Static portfolio assets live in /public/images and are referenced with
  // root-relative URLs such as /images/yt-01.png.
  // Custom uploads remain local to the current browser via IndexedDB.
  const activeSrc = customSrc || project.defaultSrc;

  const handleImageError = () => {
    // Keep the card layout intact if an asset is missing.
    console.warn(`Portfolio image failed to load: ${project.defaultSrc}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        const optimized = await compressAndStoreProjectImage(project.id, file);
        setCustomSrc(optimized);
      } catch (err) {
        console.error('Failed to save project image:', err);
      } finally {
        setIsSaving(false);
        // Clear input value so same file can be re-uploaded if desired
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const isReel = project.type === 'reel';

  return (
    <motion.div
      id={`project-card-${project.projectNumber}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container with strict Aspect Ratio */}
      <div
        className={`relative w-full rounded-xl overflow-hidden bg-[#131317] border border-[#212026] group-hover:border-[#5e322f] transition-all duration-300 shadow-md ${
          isReel ? 'aspect-[9/16]' : 'aspect-[16/9]'
        }`}
      >
        <img
          src={activeSrc}
          alt={`${project.typeLabel} ${project.projectNumber}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          onError={handleImageError}
          loading="lazy"
        />

        {/* Subtle hover gradient overlay with view button */}
        <div
          onClick={() => onSelect(project, activeSrc)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center p-4"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0b0b0d]/80 backdrop-blur-sm border border-white/10 hover:border-[#5e322f] transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-[#c98985]" />
            <span>Enlarge Preview</span>
          </span>
        </div>

        {/* Quick file replacement trigger (unobtrusive) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-[#0e0e12]/85 text-[#a6a29d] hover:text-[#f3eee8] hover:bg-[#412220] border border-white/10 transition-all duration-150 ${
            isHovered || isSaving ? 'opacity-100' : 'opacity-0'
          }`}
          title="Replace with your thumbnail file"
          aria-label={`Replace image for project ${project.projectNumber}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c98985]" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label={`Upload image for project ${project.projectNumber}`}
        />
      </div>

      {/* Minimal Metadata: Label & Project Number */}
      <div className="flex items-center justify-between pt-3 px-1 text-xs">
        <span
          id={`project-label-${project.projectNumber}`}
          className="font-medium text-[#9a969f] group-hover:text-[#e8dfd8] transition-colors tracking-wide"
        >
          {project.typeLabel}
        </span>
        <span
          id={`project-number-${project.projectNumber}`}
          className="font-['Outfit'] font-bold text-[#63616a] group-hover:text-[#c98985] transition-colors"
        >
          {project.projectNumber}
        </span>
      </div>
    </motion.div>
  );
};
