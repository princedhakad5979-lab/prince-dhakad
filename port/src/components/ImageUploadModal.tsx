import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon, Download, FileJson, AlertCircle } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/projects';
import {
  getCustomPortrait,
  getCustomProjectImage,
  compressAndStorePortrait,
  compressAndStoreProjectImage,
  clearCustomImages,
  downloadPortfolioBackupFile,
  importPortfolioFromJSON,
} from '../utils/imageStore';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'sync' | 'guide'>('upload');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleUploadSingle = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'portrait' | number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (type === 'portrait') {
          await compressAndStorePortrait(file);
          showNotice('Portrait photo updated successfully');
        } else {
          await compressAndStoreProjectImage(type, file);
          showNotice(`Project ${String(type).padStart(2, '0')} updated successfully`);
        }
        onRefresh();
      } catch (err) {
        console.error('Failed to update image:', err);
      }
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const text = ev.target?.result as string;
        if (text) {
          const success = await importPortfolioFromJSON(text);
          if (success) {
            showNotice('All portfolio images imported and synchronized!');
            onRefresh();
          } else {
            alert('Invalid portfolio-images.json file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all custom uploaded images back to defaults?')) {
      clearCustomImages();
      showNotice('All images reset to defaults');
      onRefresh();
    }
  };

  return (
    <div
      id="photo-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="photo-manager-dialog"
        className="relative w-full max-w-4xl max-h-[85vh] bg-[#121216] border border-[#26242c] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8dfd8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1e24] bg-[#15151a]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#412220] border border-[#5e322f]" />
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-[#f3eee8]">
                Photo &amp; Thumbnail Manager
              </h3>
              <p className="text-xs text-[#8e8a94]">
                Easily preview and manage your portrait and 14 project designs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="export-json-header-btn"
              onClick={() => {
                downloadPortfolioBackupFile();
                showNotice('portfolio-images.json downloaded! Send this to the AI assistant or keep as backup.');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#f3eee8] bg-[#412220] hover:bg-[#5e322f] border border-[#7a413d] transition-colors shadow-sm"
              title="Download all uploaded thumbnails and portrait as a JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#b8b3ab] hover:text-[#f3eee8] bg-[#1c1b22] hover:bg-[#25242d] transition-colors"
              title="Reset all images"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              id="close-manager-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8e8a94] hover:text-white hover:bg-[#25242d] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-[#1f1e24] bg-[#0f0f13] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#5e322f] text-[#c98985]'
                : 'border-transparent text-[#8e8a94] hover:text-[#e8dfd8]'
            }`}
          >
            Direct Upload Slots (15)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-[#5e322f] text-[#c98985]'
                : 'border-transparent text-[#8e8a94] hover:text-[#e8dfd8]'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Publish &amp; Sync Backup</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-[#5e322f] text-[#c98985]'
                : 'border-transparent text-[#8e8a94] hover:text-[#e8dfd8]'
            }`}
          >
            Static Files Guide
          </button>
        </div>

        {/* Success Notice Toast */}
        {successNotice && (
          <div className="mx-6 mt-3 p-2.5 rounded-lg bg-[#412220]/30 border border-[#5e322f] text-[#f3eee8] text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c98985]" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 max-h-[60vh]">
          {activeTab === 'upload' ? (
            <>
              {/* Portrait Slot */}
              <div>
                <h4 className="font-['Outfit'] font-bold text-sm text-[#f3eee8] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e322f]" />
                  <span>Hero Professional Portrait</span>
                </h4>
                <div className="p-4 rounded-xl bg-[#17171d] border border-[#25242c] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 rounded-lg bg-[#0e0e12] border border-[#2a2933] overflow-hidden flex items-center justify-center">
                      <img
                        src={getCustomPortrait() || '/images/portrait.png'}
                        alt="Portrait preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#f3eee8]">
                        Prince Dhakad Portrait
                      </p>
                      <p className="text-xs text-[#8e8a94]">
                        Status:{' '}
                        {getCustomPortrait() ? (
                          <span className="text-emerald-400">Custom Loaded</span>
                        ) : (
                          'Default Placeholder'
                        )}
                      </p>
                    </div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#412220] hover:bg-[#542d2a] border border-[#5e322f] text-[#f5ebea] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadSingle(e, 'portrait')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 14 Projects Slots */}
              <div>
                <h4 className="font-['Outfit'] font-bold text-sm text-[#f3eee8] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e322f]" />
                  <span>14 Project Thumbnail Slots</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_PROJECTS.map((proj) => {
                    const customImg = getCustomProjectImage(proj.id);
                    const defaultPreview =
                      proj.type === 'youtube'
                        ? `/images/yt-${proj.projectNumber}.png`
                        : `/images/reel-${String(proj.id - 10).padStart(2, '0')}.png`;

                    return (
                      <div
                        key={proj.id}
                        className="p-3 rounded-xl bg-[#17171d] border border-[#25242c] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-md bg-[#0e0e12] border border-[#282730] overflow-hidden flex items-center justify-center ${
                              proj.type === 'reel' ? 'w-10 h-14' : 'w-14 h-9'
                            }`}
                          >
                            <img
                              src={customImg || defaultPreview}
                              alt={proj.typeLabel}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#c98985]">
                                #{proj.projectNumber}
                              </span>
                              <span className="text-xs font-medium text-[#f3eee8]">
                                {proj.typeLabel}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8e8a94] font-mono">
                              {proj.aspectRatio}
                            </span>
                          </div>
                        </div>

                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[#212028] hover:bg-[#412220] border border-transparent hover:border-[#5e322f] text-[#f3eee8] transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>Set</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadSingle(e, proj.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : activeTab === 'sync' ? (
            <div className="space-y-6 text-xs text-[#a6a29d] leading-relaxed">
              {/* Alert Box Explaining Browser Storage vs Published Site */}
              <div className="p-4 rounded-xl bg-[#1b1517] border border-[#522528] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#d98380] flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-[#e8dfd8]">
                  <p className="font-semibold text-sm text-[#f3eee8]">
                    Why are uploaded images missing after publishing?
                  </p>
                  <p className="text-xs text-[#b8b3ab]">
                    When you upload an image in the preview window, modern browsers store it securely inside your private local storage (IndexedDB). When you publish or share the link (<code className="text-[#d98380] font-mono">ais-pre-...</code>), other visitors and clients visit from their own devices, which do not have your computer&apos;s private browser cache.
                  </p>
                </div>
              </div>

              {/* Action 1: Export Current Package */}
              <div className="p-4 rounded-xl bg-[#15151a] border border-[#23222a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-[#f3eee8]">
                    Step 1: Export All Uploaded Images
                  </h4>
                  <p className="text-xs text-[#8e8a94]">
                    Downloads a single <code className="font-mono text-[#c98985]">portfolio-images.json</code> file containing all 14 project designs and portrait you uploaded.
                  </p>
                </div>
                <button
                  type="button"
                  id="export-portfolio-btn"
                  onClick={() => {
                    downloadPortfolioBackupFile();
                    showNotice('portfolio-images.json downloaded successfully!');
                  }}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#412220] hover:bg-[#5e322f] border border-[#7a413d] transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup (.json)</span>
                </button>
              </div>

              {/* Action 2: How to Make it Permanent */}
              <div className="p-4 rounded-xl bg-[#15151a] border border-[#23222a] space-y-3">
                <h4 className="font-semibold text-sm text-[#f3eee8]">
                  Step 2: Make Them Permanent for All Clients &amp; Visitors
                </h4>
                <div className="space-y-2 text-xs text-[#d4cec6]">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#412220] text-[#f3eee8] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <p>
                      <strong className="text-[#f3eee8]">Send the JSON to the Assistant:</strong> Attach the downloaded <code className="font-mono text-[#c98985]">portfolio-images.json</code> in this AI Studio chat. The AI will immediately bake it directly into your published codebase.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#412220] text-[#f3eee8] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <p>
                      <strong className="text-[#f3eee8]">Or drop raw image files:</strong> You can also put your real image files into <code className="font-mono text-[#c98985]">/public/images/</code> in the code editor (e.g. <code className="font-mono text-[#c98985]">yt-01.png</code> to <code className="font-mono text-[#c98985]">yt-10.png</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Action 3: Quick Import on any Device */}
              <div className="p-4 rounded-xl bg-[#15151a] border border-[#23222a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-[#f3eee8]">
                    Restore / Import on Another Device or URL
                  </h4>
                  <p className="text-xs text-[#8e8a94]">
                    If you open the published link on another browser, you can load your exported JSON file in 1 second.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    id="import-portfolio-btn"
                    onClick={() => jsonInputRef.current?.click()}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-[#e8dfd8] bg-[#22212a] hover:bg-[#2b2a36] border border-white/10 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import JSON File</span>
                  </button>
                  <input
                    ref={jsonInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-[#a6a29d] leading-relaxed">
              <p className="text-sm font-medium text-[#f3eee8]">
                How to place static image files in the codebase:
              </p>
              <p>
                You can also add your project image files directly into the{' '}
                <code className="px-1.5 py-0.5 rounded bg-[#1c1b22] text-[#c98985]">
                  /public/images/
                </code>{' '}
                directory using these exact filenames:
              </p>

              <div className="p-4 rounded-xl bg-[#17171d] border border-[#26242c] font-mono space-y-2">
                <p className="text-[#c98985] font-semibold">Portrait:</p>
                <p className="pl-3 text-[#d4cec6]">• /public/images/portrait.png</p>

                <p className="text-[#c98985] font-semibold pt-2">10 YouTube Thumbnails (16:9):</p>
                <p className="pl-3 text-[#d4cec6]">
                  • /public/images/yt-01.png through /public/images/yt-10.png
                </p>

                <p className="text-[#c98985] font-semibold pt-2">4 Instagram Reels (9:16):</p>
                <p className="pl-3 text-[#d4cec6]">
                  • /public/images/reel-01.png through /public/images/reel-04.png
                </p>
              </div>

              <p>
                Once image files are saved into <code className="text-[#c98985]">/public/images/</code>, every person who opens your published portfolio link will immediately see your custom thumbnails!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1f1e24] bg-[#15151a] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#23222a] hover:bg-[#2d2c36] text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
