'use client';

import { useState } from 'react';
import { Globe, Loader2, ExternalLink, Layers, Code2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { captureWebsite, createWebsiteItem } from '@/lib/website-capture';
import { useContentStore } from '@/stores/content-store';
import { WebsiteMetadata } from '@/types';

interface WebsiteCaptureProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebsiteCapture({ isOpen, onClose }: WebsiteCaptureProps) {
  const [url, setUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedData, setCapturedData] = useState<{
    metadata: WebsiteMetadata;
    tags: { id: string; name: string; color: string }[];
    title: string;
    description: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('');

  const { addItem } = useContentStore();

  const handleCapture = async () => {
    if (!url.trim()) return;

    setIsCapturing(true);
    setError(null);
    setCapturedData(null);

    try {
      const data = await captureWebsite(url);
      setCapturedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture website');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSave = () => {
    if (!capturedData) return;

    const item = createWebsiteItem(
      url,
      capturedData.metadata,
      [
        ...capturedData.tags,
        ...(customCategory ? [{
          id: `category-${customCategory.toLowerCase().replace(/\s+/g, '-')}`,
          name: customCategory.toLowerCase(),
          color: '#6366f1',
        }] : []),
      ],
      capturedData.title,
      capturedData.description
    );

    addItem(item);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setCapturedData(null);
    setError(null);
    setCustomCategory('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-emerald-500" />
              <h2 className="text-lg font-semibold text-white">Capture Website</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* URL Input */}
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Website URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  disabled={isCapturing}
                />
                <button
                  onClick={handleCapture}
                  disabled={!url.trim() || isCapturing}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Globe size={18} />
                      Capture
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Captured Data Preview */}
            {capturedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Preview Card */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
                      <Globe size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{capturedData.title}</h3>
                      <p className="text-sm text-zinc-400 mt-1">{capturedData.description}</p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 mt-2"
                      >
                        <ExternalLink size={12} /> {url}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Detected Info */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Pages */}
                  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                      <Layers size={16} />
                      <span className="text-sm font-medium">Pages Detected</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{capturedData.metadata.pages.length}</p>
                    <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                      {capturedData.metadata.pages.slice(0, 5).map((page, i) => (
                        <div key={i} className="text-xs text-zinc-500 truncate">
                          {page.path}
                        </div>
                      ))}
                      {capturedData.metadata.pages.length > 5 && (
                        <div className="text-xs text-zinc-600">
                          +{capturedData.metadata.pages.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                      <Code2 size={16} />
                      <span className="text-sm font-medium">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {capturedData.metadata.techStack?.length ? (
                        capturedData.metadata.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500">Unable to detect</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Auto-generated Tags */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Auto-detected Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {capturedData.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Category */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Add Custom Category (optional)</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g., client-project, portfolio, experiment"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!capturedData}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-2"
            >
              <Check size={18} />
              Save Website
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

