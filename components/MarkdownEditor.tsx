'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Save, X, Eye, Edit3, FileText, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { generateTagsWithAI } from '@/lib/ai-tagger';
import { ContentItem } from '@/types';

// Dynamic import for markdown editor (client-side only)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900 animate-pulse rounded-lg" />
});

interface MarkdownEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  initialTitle?: string;
  editingItem?: ContentItem;
}

export default function MarkdownEditor({ 
  isOpen, 
  onClose, 
  initialContent = '', 
  initialTitle = '',
  editingItem 
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle || 'Untitled Document');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  
  const { addItem, updateItem, openaiKey } = useContentStore();

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Generate tags if we have an API key
      setIsGeneratingTags(true);
      const tagResult = await generateTagsWithAI(content, 'markdown', `${title}.md`, openaiKey || undefined);
      setIsGeneratingTags(false);

      if (editingItem) {
        // Update existing item
        updateItem(editingItem.id, {
          title,
          content,
          description: tagResult.description,
          tags: tagResult.tags,
        });
      } else {
        // Create new item
        const newItem: ContentItem = {
          id: `md-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          type: 'markdown',
          title,
          content,
          description: tagResult.description,
          storageLocation: 'local',
          tags: tagResult.tags,
          metadata: {
            wordCount: content.split(/\s+/).length,
            charCount: content.length,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          folder: tagResult.suggestedFolder,
        };
        addItem(newItem);
      }

      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
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
          className="w-full max-w-4xl h-[80vh] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-emerald-500" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent text-lg font-medium text-white border-none outline-none"
                placeholder="Document title..."
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Preview toggle */}
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-2 rounded-lg transition-colors ${
                  isPreview ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
              </button>

              {/* AI Tags button */}
              <button
                onClick={async () => {
                  setIsGeneratingTags(true);
                  await generateTagsWithAI(content, 'markdown', `${title}.md`, openaiKey || undefined);
                  setIsGeneratingTags(false);
                }}
                disabled={isGeneratingTags}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50"
              >
                {isGeneratingTags ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span className="text-sm">AI Tags</span>
              </button>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span className="text-sm">Save</span>
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden" data-color-mode="dark">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview={isPreview ? 'preview' : 'edit'}
              height="100%"
              className="!bg-transparent"
              style={{ background: 'transparent' }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{content.length} characters</span>
            </div>
            <div>
              Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">⌘S</kbd> to save
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

