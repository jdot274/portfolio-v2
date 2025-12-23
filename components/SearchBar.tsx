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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
        style={{
          backgroundColor: isFocused ? 'var(--color-surface)' : 'var(--color-surface)',
          border: `1px solid ${isFocused ? 'var(--color-border-strong)' : 'var(--color-border)'}`,
          boxShadow: isFocused ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
        }}
      >
        <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search everything..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--color-text)' }}
        />
        
        {/* Type filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor: activeFilter.type ? 'var(--color-accent-muted)' : 'transparent',
            color: activeFilter.type ? 'var(--color-accent)' : 'var(--color-text-muted)'
          }}
        >
          <Filter size={16} />
        </button>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
        )}

        {/* Keyboard hint */}
        {!isFocused && (
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            <Command size={12} />
            <span>K</span>
          </div>
        )}
      </div>

      {/* Active filters display */}
      {activeFilter.type && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Filtering:</span>
          <span 
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
          >
            {getContentTypeIcon(activeFilter.type)}
            {CONTENT_TYPES.find(contentType => contentType.type === activeFilter.type)?.label}
            <button onClick={() => handleTypeFilter(undefined)} className="ml-1">
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
            className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-50"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="p-2">
              <p className="text-xs px-2 py-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Filter by type</p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleTypeFilter(undefined)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: !activeFilter.type ? 'var(--color-accent-muted)' : 'transparent',
                    color: !activeFilter.type ? 'var(--color-accent)' : 'var(--color-text-muted)'
                  }}
                >
                  📚 All ({items.length})
                </button>
                {CONTENT_TYPES.map(({ type, label }) => {
                  const count = items.filter(item => item.type === type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeFilter(type)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: activeFilter.type === type ? 'var(--color-accent-muted)' : 'transparent',
                        color: activeFilter.type === type ? 'var(--color-accent)' : 'var(--color-text-muted)'
                      }}
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
