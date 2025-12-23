'use client';

import { useState } from 'react';
import { 
  FolderOpen, Search, Grid, List, LayoutGrid, Settings, 
  Plus, ChevronRight, Github, FileCode, Tag, Sparkles,
  Kanban, LayoutDashboard, Globe, Image, Link2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentType } from '@/types';

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
  
  const [expandedSections, setExpandedSections] = useState({
    folders: true,
    tags: true,
  });

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
    <aside className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Portfolio V2</h1>
            <p className="text-xs text-zinc-500">Knowledge Hub</p>
          </div>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="p-3 border-b border-zinc-800">
        <div className="grid grid-cols-5 bg-zinc-900 rounded-lg p-1 gap-0.5">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewModeChange(view.id)}
              title={view.label}
              className={`flex items-center justify-center py-2 rounded-md text-xs transition-colors ${
                viewMode === view.id 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {view.icon}
            </button>
          ))}
        </div>
        <div className="text-center mt-1">
          <span className="text-[10px] text-zinc-500">
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
            className="flex items-center justify-between w-full text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2"
          >
            <span>Smart Folders</span>
            <ChevronRight 
              size={14} 
              className={`transition-transform ${expandedSections.folders ? 'rotate-90' : ''}`} 
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
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      activeFilter.folder === folder.id
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                    }`}
                  >
                    <span>{folder.icon}</span>
                    <span className="flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-zinc-600">{getItemCount(folder.types)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2"
          >
            <span>Tags ({allTags.length})</span>
            <ChevronRight 
              size={14} 
              className={`transition-transform ${expandedSections.tags ? 'rotate-90' : ''}`} 
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
                    className="text-xs px-2 py-1 rounded-full transition-colors hover:opacity-80"
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
                  <span className="text-xs px-2 py-1 text-zinc-500">
                    +{allTags.length - 20} more
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-sm transition-colors">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
}
