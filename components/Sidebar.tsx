'use client';

import { useState, useEffect } from 'react';
import { 
  FolderOpen, Search, Grid, List, LayoutGrid, Settings, 
  Plus, ChevronRight, Github, FileCode, Tag, Sparkles,
  Kanban, LayoutDashboard, Globe, Image, Link2, FileText,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { useThemeStore } from '@/stores/theme-store';
import { ContentType } from '@/types';
import { ThemeSwitcher } from './ThemeSwitcher';

export type ViewMode = 'grid' | 'list' | 'canvas' | 'board' | 'dashboard';

interface SidebarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Sidebar({ viewMode, onViewModeChange }: SidebarProps) {
  const { 
    activeFilter, 
    setActiveFilter,
    getAllTags,
    items,
  } = useContentStore();
  
  const { currentTheme, getTheme } = useThemeStore();
  const theme = getTheme();
  
  const [expandedSections, setExpandedSections] = useState({
    folders: true,
    tags: true,
  });

  // Apply theme on mount and changes
  useEffect(() => {
    const { applyTheme } = require('@/lib/themes');
    applyTheme(theme);
  }, [currentTheme, theme]);

  const allTags = getAllTags();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const folders = [
    { id: 'all', name: 'All Items', icon: '📚', types: undefined },
    { id: 'projects', name: 'Projects', icon: '📂', types: ['repo'] as ContentType[] },
    { id: 'webapps', name: 'Web Apps', icon: '🌐', types: ['webapp', 'website'] as ContentType[] },
    { id: 'snippets', name: 'Snippets', icon: '💻', types: ['snippet', 'gist'] as ContentType[] },
    { id: 'documents', name: 'Documents', icon: '📄', types: ['document', 'markdown'] as ContentType[] },
    { id: 'media', name: 'Media', icon: '🖼️', types: ['image', 'video'] as ContentType[] },
    { id: 'links', name: 'Links', icon: '🔗', types: ['link'] as ContentType[] },
  ];

  const getItemCount = (types?: ContentType[]) => {
    if (!types) return items.length;
    return items.filter(item => types.includes(item.type)).length;
  };

  const views = [
    { id: 'dashboard' as ViewMode, icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
    { id: 'grid' as ViewMode, icon: <Grid size={14} />, label: 'Grid' },
    { id: 'list' as ViewMode, icon: <List size={14} />, label: 'List' },
    { id: 'canvas' as ViewMode, icon: <LayoutGrid size={14} />, label: 'Canvas' },
    { id: 'board' as ViewMode, icon: <Kanban size={14} />, label: 'Board' },
  ];

  return (
    <aside className="w-64 h-full bg-[var(--color-layer1)] border-r border-[var(--color-border)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.info})` }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-[var(--color-text)]">Portfolio V2</h1>
            <p className="text-xs text-[var(--color-text-subtle)]">Knowledge Hub</p>
          </div>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <div className="grid grid-cols-5 bg-[var(--color-base)] rounded-lg p-1 gap-0.5">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewModeChange(view.id)}
              title={view.label}
              className={`flex items-center justify-center py-2 rounded-md text-xs transition-all duration-200 ${
                viewMode === view.id 
                  ? 'bg-[var(--color-layer3)] text-[var(--color-text)] shadow-sm' 
                  : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] hover:bg-[var(--color-layer2)]'
              }`}
            >
              {view.icon}
            </button>
          ))}
        </div>
        <div className="text-center mt-1">
          <span className="text-[10px] text-[var(--color-text-subtle)]">
            {views.find(v => v.id === viewMode)?.label} View
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Smart Folders */}
        <div className="p-3">
          <button
            onClick={() => toggleSection('folders')}
            className="flex items-center justify-between w-full text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider mb-2"
          >
            <span>Smart Folders</span>
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-200 ${expandedSections.folders ? 'rotate-90' : ''}`} 
            />
          </button>
          <AnimatePresence>
            {expandedSections.folders && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 overflow-hidden"
              >
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFilter({ 
                      type: folder.types?.[0],
                      folder: folder.id 
                    })}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-200 ${
                      activeFilter.folder === folder.id
                        ? 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] border border-transparent'
                    }`}
                  >
                    <span>{folder.icon}</span>
                    <span className="flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-[var(--color-text-subtle)]">{getItemCount(folder.types)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider mb-2"
          >
            <span>Tags ({allTags.length})</span>
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-200 ${expandedSections.tags ? 'rotate-90' : ''}`} 
            />
          </button>
          <AnimatePresence>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-1.5 overflow-hidden"
              >
                {allTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setActiveFilter({ tags: [tag.id] })}
                    className="text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color,
                      border: activeFilter.tags?.includes(tag.id) ? `1px solid ${tag.color}` : '1px solid transparent'
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
                {allTags.length > 20 && (
                  <span className="text-xs px-2 py-1 text-[var(--color-text-subtle)]">
                    +{allTags.length - 20} more
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer with Theme Switcher */}
      <div className="p-3 border-t border-[var(--color-border)] space-y-2">
        {/* Theme Switcher */}
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-[var(--color-text-subtle)]" />
          <span className="text-sm text-[var(--color-text-muted)] flex-1">Theme</span>
          <ThemeSwitcher />
        </div>
        
        {/* Settings */}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm transition-all duration-200">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
}
