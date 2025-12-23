'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, Image, Video, Code, File, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeFile, formatFileSize, getStorageIcon, uploadToGitHub } from '@/lib/upload-router';
import { generateTagsWithAI, extractTextContent } from '@/lib/ai-tagger';
import { useContentStore } from '@/stores/content-store';
import { ContentItem } from '@/types';

interface UploadDropzoneProps {
  onUploadComplete?: (item: ContentItem) => void;
}

export default function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { addItem, githubUsername, githubToken, openaiKey } = useContentStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      await processFile(file);
    }

    setIsUploading(false);
    setUploadProgress('');
  }, [githubUsername, githubToken, openaiKey]);

  const processFile = async (file: File) => {
    setUploadProgress(`Analyzing ${file.name}...`);

    // Analyze the file to determine where it should go
    const analysis = analyzeFile(file);
    
    setUploadProgress(`Routing to ${analysis.storageLocation}...`);

    // Extract text content for AI tagging
    const textContent = await extractTextContent(file);

    // Generate tags with AI
    setUploadProgress(`Generating tags for ${file.name}...`);
    const tagResult = await generateTagsWithAI(
      textContent,
      analysis.type,
      file.name,
      openaiKey || undefined
    );

    // Create content item
    const newItem: ContentItem = {
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: analysis.type,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      description: tagResult.description,
      storageLocation: analysis.storageLocation,
      tags: tagResult.tags,
      metadata: {
        filename: file.name,
        size: file.size,
        mimeType: file.type,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folder: tagResult.suggestedFolder,
    };

    // Upload to storage
    if (analysis.storageLocation === 'github' && githubToken) {
      setUploadProgress(`Uploading ${file.name} to GitHub...`);
      const uploadResult = await uploadToGitHub(
        file,
        `assets/${file.name}`,
        githubToken,
        githubUsername,
        'portfolio-v2-content'
      );
      
      if (uploadResult.success) {
        newItem.url = uploadResult.url;
        newItem.storagePath = `assets/${file.name}`;
      }
    }

    // Add to store
    addItem(newItem);
    onUploadComplete?.(newItem);
    
    setUploadProgress(`✓ ${file.name} added`);
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    Promise.all(Array.from(files).map(processFile)).then(() => {
      setIsUploading(false);
      setUploadProgress('');
    });
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={20} />;
      case 'video': return <Video size={20} />;
      case 'snippet': return <Code size={20} />;
      case 'document': case 'markdown': return <FileText size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
        ${isDragging 
          ? 'border-emerald-500 bg-emerald-500/10' 
          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/50'
        }
      `}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-3"
          >
            <Loader2 size={32} className="text-emerald-500 animate-spin" />
            <p className="text-sm text-zinc-400">{uploadProgress}</p>
          </motion.div>
        ) : isDragging ? (
          <motion.div
            key="dragging"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-3"
          >
            <Upload size={32} className="text-emerald-500" />
            <p className="text-lg font-medium text-emerald-500">Drop files here</p>
            <p className="text-sm text-zinc-500">Files will be auto-routed to the best storage</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <Upload size={24} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Code, documents, images, videos - anything!
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                🐙 GitHub
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                📁 Google Drive
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                🤖 AI Tags
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

