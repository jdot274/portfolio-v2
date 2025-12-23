'use client';

import { useState, useRef } from 'react';
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
    <aside className="glass-sidebar w-72 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-5">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center button-primary"
          >
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <div>
            <h1 className="font-semibold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>
              Portfolio
            </h1>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-ghost)' }}>
              Knowledge Hub
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="px-4 pb-4">
        <div 
          className="p-1.5 rounded-xl flex gap-1"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--color-border)'
          }}
        >
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewModeChange(view.id)}
              className="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: viewMode === view.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: viewMode === view.id ? 'var(--color-text-primary)' : 'var(--color-text-ghost)',
                border: viewMode === view.id ? '1px solid var(--color-border-glow)' : '1px solid transparent',
                boxShadow: viewMode === view.id ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : 'none'
              }}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Folders Section */}
        <div className="py-3">
          <button
            onClick={() => toggleSection('folders')}
            className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-ghost)' }}
          >
            <span>Folders</span>
            <motion.svg 
              className="w-3 h-3"
              animate={{ rotate: expandedSections.folders ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </motion.svg>
          </button>
          
          <AnimatePresence>
            {expandedSections.folders && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="py-2 space-y-2">
                  {folders.map((folder, i) => {
                    const isActive = activeFilter.folder === folder.id || (folder.id === 'all' && !activeFilter.folder);
                    return (
                      <SidebarItem
                        key={folder.id}
                        icon={folder.icon}
                        label={folder.name}
                        count={getItemCount(folder.types)}
                        isActive={isActive}
                        onClick={() => setActiveFilter({ type: folder.types?.[0], folder: folder.id })}
                        delay={i * 0.03}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags Section */}
        <div 
          className="py-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-ghost)' }}
          >
            <span>Tags</span>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--color-text-ghost)' }}>{allTags.length}</span>
              <motion.svg 
                className="w-3 h-3"
                animate={{ rotate: expandedSections.tags ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </motion.svg>
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="py-3 flex flex-wrap gap-2">
                  {allTags.slice(0, 12).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setActiveFilter({ tags: [tag.id] })}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-tertiary)'
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
        className="p-4"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button className="glass-button w-full flex items-center gap-3 px-4 py-3 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
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

// Sidebar Item with spotlight effect
function SidebarItem({ 
  icon, 
  label, 
  count, 
  isActive, 
  onClick,
  delay = 0
}: { 
  icon: string; 
  label: string; 
  count: number; 
  isActive: boolean; 
  onClick: () => void;
  delay?: number;
}) {
  const itemRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    itemRef.current.style.setProperty('--mouse-x', `${x}%`);
    itemRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.button
      ref={itemRef}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="glass-card w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left"
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        borderColor: isActive ? 'var(--color-border-bright)' : 'var(--color-border)',
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      }}
    >
      <span className="text-lg icon-shimmer">{icon}</span>
      <span className="flex-1">{label}</span>
      <span 
        className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded-md"
        style={{ 
          background: 'rgba(255,255,255,0.06)',
          color: 'var(--color-text-ghost)'
        }}
      >
        {count}
      </span>
    </motion.button>
  );
}
