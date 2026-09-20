import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { ProjectItem } from './types';
import { initImageStore, subscribeToImageStore } from './utils/imageStore';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeImgSrc, setActiveImgSrc] = useState<string | null>(null);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Ensure IndexedDB is initialized and cached
    initImageStore().then(() => {
      setRefreshKey((k) => k + 1);
    });

    const unsubscribe = subscribeToImageStore(() => {
      setRefreshKey((k) => k + 1);
    });
    return unsubscribe;
  }, []);

  const handleSelectProject = (project: ProjectItem, src: string) => {
    setSelectedProject(project);
    setActiveImgSrc(src);
  };

  const handleNavigateLightbox = (nextProj: ProjectItem, nextSrc: string) => {
    setSelectedProject(nextProj);
    setActiveImgSrc(nextSrc);
  };

  const handleRefreshImages = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      key={refreshKey}
      className="min-h-screen w-full overflow-x-hidden bg-[#0b0b0d] text-[#e8dfd8] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#412220] selection:text-[#f5ebea]"
    >
      {/* Website Preloader */}
      <Preloader />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Landing Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onOpenManageImages={() => setIsPhotoManagerOpen(true)} />

        {/* 2. About / What I Do Section */}
        <AboutSection />

        {/* 3. Selected Work Projects Section (10 YouTube + 4 Instagram Reels) */}
        <ProjectsSection onSelectProject={handleSelectProject} />

        {/* 4. Contact Section */}
        <ContactSection />
      </main>

      {/* 5. Minimal Footer */}
      <Footer onOpenManageImages={() => setIsPhotoManagerOpen(true)} />

      {/* Lightbox Modal for HD Inspection */}
      <LightboxModal
        project={selectedProject}
        activeSrc={activeImgSrc}
        onClose={() => setSelectedProject(null)}
        onNavigate={handleNavigateLightbox}
      />

      {/* Photo / Thumbnail Manager Modal */}
      <ImageUploadModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        onRefresh={handleRefreshImages}
      />
    </div>
  );
}

