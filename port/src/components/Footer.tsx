import React from 'react';
import { Download } from 'lucide-react';

interface FooterProps {
  onOpenManageImages?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenManageImages }) => {
  return (
    <footer
      id="main-footer"
      className="py-12 border-t border-[#17171d] bg-[#09090b] text-[#8e8a94]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: © 2026 Prince Dhakad */}
        <div className="flex items-center gap-4">
          <p
            id="footer-copyright"
            className="text-sm font-medium text-[#8e8a94]"
          >
            © 2026 Prince Dhakad
          </p>

          {onOpenManageImages && (
            <button
              type="button"
              id="footer-sync-btn"
              onClick={onOpenManageImages}
              className="inline-flex items-center gap-1.5 text-xs text-[#7d7983] hover:text-[#c98985] transition-colors py-1 px-2 rounded-md hover:bg-[#15141a]"
              title="Backup or sync uploaded project images"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sync &amp; Export Assets</span>
            </button>
          )}
        </div>

        {/* Right: Graphic Designer */}
        <p
          id="footer-title"
          className="text-xs uppercase tracking-widest text-[#a6a29d] font-semibold"
        >
          Graphic Designer
        </p>
      </div>
    </footer>
  );
};
