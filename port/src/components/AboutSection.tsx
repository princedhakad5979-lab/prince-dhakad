import React from 'react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 sm:py-24 border-y border-[#18181e] bg-[#0d0d10] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-baseline"
        >
          {/* Section Heading: “What I Do” */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#412220] border border-[#5e322f]" />
              <h2
                id="about-heading"
                className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#f3eee8] tracking-tight"
              >
                What I Do
              </h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8e8a94] font-medium pl-5">
              Core Focus &amp; Philosophy
            </p>
          </div>

          {/* Intro Text */}
          <div className="md:col-span-8">
            <p
              id="about-description-text"
              className="text-xl sm:text-2xl md:text-3xl font-normal text-[#d4cec6] leading-snug tracking-tight"
            >
              “I design attention-grabbing visuals for creators, brands and digital platforms, with a focus on clean composition, strong typography and visual storytelling.”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
