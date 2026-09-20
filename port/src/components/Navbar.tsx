import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#0b0b0d]/95 backdrop-blur-md border-b border-[#1f1f24] py-3.5 sm:py-4'
          : 'bg-[#0b0b0d]/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none py-4 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          id="nav-brand-link"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 sm:gap-3 text-decoration-none min-w-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#412220] border border-[#5e322f] group-hover:scale-125 transition-transform duration-200 shrink-0" />
          <span className="font-['Outfit'] font-bold text-base sm:text-xl tracking-tight text-[#f3eee8] group-hover:text-white transition-colors truncate">
            Prince Dhakad
          </span>
          <span className="hidden lg:inline-block text-xs font-semibold uppercase tracking-widest text-[#a6a29d] border-l border-[#26252b] pl-3">
            Graphic Designer
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          <a
            href="#about"
            id="nav-link-about"
            className="text-sm font-medium text-[#a6a29d] hover:text-[#f3eee8] transition-colors"
          >
            About
          </a>
          <a
            href="#projects"
            id="nav-link-projects"
            className="text-sm font-medium text-[#a6a29d] hover:text-[#f3eee8] transition-colors"
          >
            Work
          </a>
          <a
            href="#contact"
            id="nav-link-contact"
            className="text-sm font-medium text-[#a6a29d] hover:text-[#f3eee8] transition-colors"
          >
            Contact
          </a>

          {/* Direct CTA Button */}
          <a
            href="#contact"
            id="nav-btn-work-together"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#f3eee8] bg-[#16161a] hover:bg-[#412220] border border-[#27262c] hover:border-[#5e322f] transition-all duration-200 group"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#c98985] group-hover:text-white transition-colors" />
          </a>
        </nav>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#contact"
            id="mobile-nav-btn-talk"
            onClick={closeMenu}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#f3eee8] bg-[#16161a] hover:bg-[#412220] border border-[#27262c] transition-colors"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight className="w-3 h-3 text-[#c98985]" />
          </a>

          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg bg-[#16161a] border border-[#27262c] text-[#e8dfd8] hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-[#c98985]" />
            ) : (
              <Menu className="w-4 h-4 text-[#e8dfd8]" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#412220] via-[#753d39] to-[#c98985] origin-left pointer-events-none"
        style={{ scaleX }}
      />

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="md:hidden w-full border-t border-[#1f1f24] bg-[#0b0b0d]/98 backdrop-blur-xl px-5 py-5 transition-all"
        >
          <div className="flex flex-col space-y-4">
            <a
              href="#about"
              onClick={closeMenu}
              className="text-base font-medium text-[#d4cec6] hover:text-white py-1 flex items-center justify-between border-b border-[#1a1920]"
            >
              <span>About (What I Do)</span>
              <span className="text-xs text-[#7e7b85]">01</span>
            </a>
            <a
              href="#projects"
              onClick={closeMenu}
              className="text-base font-medium text-[#d4cec6] hover:text-white py-1 flex items-center justify-between border-b border-[#1a1920]"
            >
              <span>Selected Work (14 Projects)</span>
              <span className="text-xs text-[#7e7b85]">02</span>
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="text-base font-medium text-[#d4cec6] hover:text-white py-1 flex items-center justify-between"
            >
              <span>Contact Prince</span>
              <span className="text-xs text-[#7e7b85]">03</span>
            </a>

            <div className="pt-2">
              <a
                href="#contact"
                onClick={closeMenu}
                className="w-full py-3 rounded-xl font-semibold text-sm text-[#f5ebea] bg-[#412220] hover:bg-[#542d2a] border border-[#5e322f] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Start a Collaboration</span>
                <ArrowUpRight className="w-4 h-4 text-[#f5ebea]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
