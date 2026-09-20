import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Disable body scroll during preload
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        // Organic progress curve
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  const letters = ['P', 'R', 'I', 'N', 'C', 'E'];

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="website-preloader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.8,
              ease: [0.77, 0, 0.175, 1],
            },
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0b0b0d] text-[#f3eee8] p-8 sm:p-12 select-none"
        >
          {/* Top Bar of Preloader */}
          <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[#8e8a94] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#412220] border border-[#5e322f] animate-pulse" />
              <span>Portfolio 2026</span>
            </div>
            <span className="text-[#a6a29d]">Graphic Designer</span>
          </div>

          {/* Central Typography: "PRINCE" */}
          <div className="flex flex-col items-center justify-center my-auto">
            {/* Letter-by-letter reveal */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-hidden mb-4">
              {letters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-['Outfit'] text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-[#f3eee8] inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#412220] border border-[#753d39] ml-1 self-end mb-3 sm:mb-4 md:mb-6 shadow-[0_0_15px_rgba(65,34,32,0.8)]"
              />
            </div>

            {/* Sub-label */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#a6a29d]"
            >
              Visuals • Thumbnails • Digital Design
            </motion.p>
          </div>

          {/* Bottom Bar: Loading bar and percentage */}
          <div className="max-w-md w-full mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#8e8a94]">
              <span>Loading Experience</span>
              <span className="font-bold text-[#c98985]">{progress}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full h-[3px] bg-[#1a1920] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#412220] via-[#5e322f] to-[#c98985]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
