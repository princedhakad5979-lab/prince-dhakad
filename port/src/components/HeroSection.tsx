import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Camera, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  getCustomPortrait,
  compressAndStorePortrait,
  subscribeToImageStore,
} from '../utils/imageStore';

interface HeroSectionProps {
  onOpenManageImages?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenManageImages }) => {
  const [portraitSrc, setPortraitSrc] = useState<string>(() => {
    return getCustomPortrait() || '/images/portrait.png';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToImageStore(() => {
      const stored = getCustomPortrait();
      if (stored) {
        setPortraitSrc(stored);
      }
    });
    return unsubscribe;
  }, []);

  const handleImageError = () => {
    console.warn(`Portrait image failed to load: ${portraitSrc}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        const optimized = await compressAndStorePortrait(file);
        setPortraitSrc(optimized);
      } catch (err) {
        console.error('Failed to save portrait:', err);
      } finally {
        setIsSaving(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <section
      id="hero-section"
      className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden"
    >
      {/* Subtle warm ambient glow behind the hero, NOT flashy */}
      <div
        className="absolute top-1/4 right-10 -z-10 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #412220 0%, #2b1716 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTA (7 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Small Professional Title */}
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-8 h-[2px] bg-[#5e322f]" />
              <span
                id="hero-professional-title"
                className="px-3.5 py-1 rounded-full bg-[#412220]/80 border border-[#5e322f] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#f2e1df]"
              >
                Graphic Designer
              </span>
            </div>

            {/* Large Heading: "Prince Dhakad" (Strongest visual element on the page) */}
            <h1
              id="hero-heading-name"
              className="font-['Outfit'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#f3eee8] tracking-tight leading-[1.04] mb-8"
            >
              Prince <span className="text-[#f3eee8]">Dhakad</span>
            </h1>

            {/* 2-line Bio */}
            <div className="max-w-xl text-[#b8b3ab] text-lg sm:text-xl font-normal leading-relaxed mb-10 space-y-2">
              <p>
                I create bold, engaging visuals that help brands and creators stand out.
              </p>
              <p className="text-[#969189]">
                Specialized in thumbnails, social media creatives and digital design.
              </p>
            </div>

            {/* CTA Button: “Let’s Work Together” */}
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#contact"
                id="hero-cta-work-together"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base text-[#f5ebea] bg-[#412220] hover:bg-[#542d2a] border border-[#5e322f] hover:border-[#753d39] shadow-lg shadow-[#412220]/30 hover:shadow-[#412220]/50 active:scale-[0.98] transition-all duration-200"
              >
                <span>Let’s Work Together</span>
                <ArrowRight className="w-5 h-5 text-[#f5ebea]" />
              </a>

              <a
                href="#projects"
                id="hero-cta-explore-work"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-medium text-base text-[#b8b3ab] hover:text-[#f3eee8] bg-[#141418] hover:bg-[#1c1c22] border border-[#24232a] transition-all duration-200"
              >
                <span>View Selected Work</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Prominent Portrait Photo (5 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div
              id="hero-portrait-container"
              className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-2xl overflow-hidden bg-[#141418] border border-[#26242c] shadow-2xl transition-all duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Corner accent in deep burgundy-brown */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10">
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#5e322f]" />
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none z-10">
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#412220]" />
              </div>

              {/* Portrait Image */}
              <img
                id="hero-portrait-image"
                src={portraitSrc}
                alt="Prince Dhakad - Graphic Designer"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                onError={handleImageError}
              />

              {/* Subtle bottom vignette for photo cohesion */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/50 to-transparent pointer-events-none" />

              {/* Discreet photo upload trigger for Prince to easily drop his photo */}
              <div
                className={`absolute inset-x-4 bottom-4 z-20 flex items-center justify-between p-2.5 rounded-xl bg-[#0e0e12]/90 backdrop-blur-md border border-[#282730] transition-opacity duration-200 ${
                  isHovered || isSaving ? 'opacity-100' : 'opacity-0 sm:opacity-0 hover:opacity-100'
                }`}
              >
                <div className="text-left pl-2">
                  <p className="text-xs font-semibold text-[#f3eee8]">Professional Portrait</p>
                  <p className="text-[11px] text-[#8e8a94]">Prince Dhakad</p>
                </div>
                <button
                  type="button"
                  id="hero-upload-portrait-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#f3eee8] bg-[#1f1e26] hover:bg-[#412220] transition-colors"
                  title="Upload or change photo"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c98985]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload professional portrait"
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
