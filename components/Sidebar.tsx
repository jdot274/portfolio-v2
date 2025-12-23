'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentType } from '@/types';

export type ViewMode = 'grid' | 'list' | 'canvas' | 'board' | 'dashboard';

interface SidebarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Sidebar({ viewMode, onViewModeChange }: SidebarProps) {
  const { activeFilter, setActiveFilter, getAllTags, items } = useContentStore();
  const [expandedSections, setExpandedSections] = useState({ folders: true, tags: false });

  const allTags = getAllTags();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const folders = [
    { id: 'all', name: 'All Docs', icon: '📚', types: undefined },
    { id: 'projects', name: 'Projects', icon: '📂', types: ['repo'] as ContentType[] },
    { id: 'webapps', name: 'Web Apps', icon: '🌐', types: ['webapp', 'website'] as ContentType[] },
    { id: 'snippets', name: 'Snippets', icon: '💻', types: ['snippet', 'gist'] as ContentType[] },
    { id: 'documents', name: 'Documents', icon: '📄', types: ['document', 'markdown'] as ContentType[] },
  ];

  const getItemCount = (types?: ContentType[]) => {
    if (!types) return items.length;
    return items.filter(item => types.includes(item.type)).length;
  };

  const views = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard' },
    { id: 'grid' as ViewMode, label: 'Grid' },
    { id: 'list' as ViewMode, label: 'List' },
    { id: 'canvas' as ViewMode, label: 'Canvas' },
    { id: 'board' as ViewMode, label: 'Board' },
  ];

  return (
    <aside 
      className="w-64 h-full flex flex-col"
      style={{ 
        background: 'var(--color-layer1)',
        borderRight: '1px solid var(--color-border)'
      }}
    >
      {/* Logo */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-accent), #6366f1)',
              boxShadow: '0 0 20px var(--color-accent-glow)'
            }}
          >
            <span className="text-white text-sm font-semibold">P</span>
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              Portfolio
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Knowledge Hub
            </p>
          </div>
        </div>
      </div>

      {/* View Mode */}
      <div className="px-3 pb-3">
        <div 
          className="p-1 rounded-lg flex gap-0.5"
          style={{ background: 'var(--color-base)' }}
        >
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewModeChange(view.id)}
              className="flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200"
              style={{
                background: viewMode === view.id ? 'var(--color-surface-active)' : 'transparent',
                color: viewMode === view.id ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="py-2">
          <button
            onClick={() => toggleSection('folders')}
            className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>Folders</span>
            <svg 
              className={`w-3 h-3 transition-transform duration-200 ${expandedSections.folders ? 'rotate-90' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <AnimatePresence>
            {expandedSections.folders && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-1 space-y-0.5">
                  {folders.map((folder) => {
                    const isActive = activeFilter.folder === folder.id || (folder.id === 'all' && !activeFilter.folder);
                    return (
                      <button
                        key={folder.id}
                        onClick={() => setActiveFilter({ type: folder.types?.[0], folder: folder.id })}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150"
                        style={{
                          background: isActive ? 'var(--color-surface-active)' : 'transparent',
                          color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
                        }}
                      >
                        <span className="text-base">{folder.icon}</span>
                        <span className="flex-1 text-left">{folder.name}</span>
                        <span 
                          className="text-xs tabular-nums"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {getItemCount(folder.types)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div className="py-2" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>Tags</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                {allTags.length}
              </span>
              <svg 
                className={`w-3 h-3 transition-transform duration-200 ${expandedSections.tags ? 'rotate-90' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-2 flex flex-wrap gap-1.5">
                  {allTags.slice(0, 12).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setActiveFilter({ tags: [tag.id] })}
                      className="text-xs px-2 py-1 rounded-md transition-all duration-150"
                      style={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="p-3"
        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      >
        <button 
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-subtle)'
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
    </aside>
  );
}
