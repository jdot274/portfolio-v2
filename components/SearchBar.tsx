'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Command, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentType } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';

const CONTENT_TYPES: { type: ContentType; label: string }[] = [
  { type: 'repo', label: 'Repositories' },
  { type: 'gist', label: 'Gists' },
  { type: 'snippet', label: 'Snippets' },
  { type: 'markdown', label: 'Markdown' },
  { type: 'document', label: 'Documents' },
  { type: 'image', label: 'Images' },
  { type: 'video', label: 'Videos' },
  { type: 'link', label: 'Links' },
];

export default function SearchBar() {
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, items } = useContentStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setShowFilters(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTypeFilter = (type: ContentType | undefined) => {
    setActiveFilter({ type });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilter({});
  };

  const hasActiveFilters = searchQuery || activeFilter.type || activeFilter.tags?.length;

  return (
    <div className="relative">
      <div
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all
          ${isFocused 
            ? 'bg-zinc-900 border-zinc-700 shadow-lg' 
            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
          }
        `}
      >
        <Search size={18} className="text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search everything..."
          className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-sm"
        />
        
        {/* Type filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-1.5 rounded-lg transition-colors ${
            activeFilter.type 
              ? 'bg-emerald-500/20 text-emerald-500' 
              : 'hover:bg-zinc-800 text-zinc-500'
          }`}
        >
          <Filter size={16} />
        </button>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500"
          >
            <X size={16} />
          </button>
        )}

        {/* Keyboard hint */}
        {!isFocused && (
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <Command size={12} />
            <span>K</span>
          </div>
        )}
      </div>

      {/* Active filters display */}
      {activeFilter.type && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-zinc-500">Filtering:</span>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500">
            {getContentTypeIcon(activeFilter.type)}
            {CONTENT_TYPES.find(t => t.type === activeFilter.type)?.label}
            <button onClick={() => handleTypeFilter(undefined)} className="ml-1 hover:text-white">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-xs text-zinc-500 px-2 py-1 uppercase tracking-wider">Filter by type</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleTypeFilter(undefined)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    !activeFilter.type 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  📚 All ({items.length})
                </button>
                {CONTENT_TYPES.map(({ type, label }) => {
                  const count = items.filter(i => i.type === type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeFilter(type)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeFilter.type === type 
                          ? 'bg-emerald-500/20 text-emerald-500' 
                          : 'text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {getContentTypeIcon(type)} {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

