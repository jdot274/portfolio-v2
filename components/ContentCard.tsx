'use client';

import { ExternalLink, Github, Star, GitFork, MoreVertical, Trash2, Edit, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentItem } from '@/types';
import { getContentTypeIcon, getStorageIcon } from '@/lib/upload-router';
import { useState } from 'react';

interface ContentCardProps {
  item: ContentItem;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

export default function ContentCard({ item, onEdit, onDelete }: ContentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group rounded-xl overflow-hidden transition-all"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)'
      }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <h3 className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div 
                className="absolute right-0 top-8 rounded-lg shadow-xl py-1 z-10 min-w-[120px]"
                style={{ 
                  backgroundColor: 'var(--color-layer3)',
                  border: '1px solid var(--color-border-strong)'
                }}
              >
                <button
                  onClick={() => { onEdit?.(item); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => { onDelete?.(item.id); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-error)' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {item.description && (
          <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--color-text-muted)' }}>
            {item.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.aiGenerated && <span className="opacity-60">✨</span>}
              {tag.name}
            </span>
          ))}
          {item.tags.length > 4 && (
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-layer3)', color: 'var(--color-text-muted)' }}
            >
              +{item.tags.length - 4}
            </span>
          )}
        </div>

        {/* GitHub stats */}
        {item.github && (
          <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
            {item.github.stars !== undefined && item.github.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star size={12} /> {item.github.stars}
              </span>
            )}
            {item.github.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLanguageColor(item.github.language) }}
                />
                {item.github.language}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div 
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>{getStorageIcon(item.storageLocation)}</span>
            <span>{formatDate(item.updatedAt)}</span>
          </div>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              <ExternalLink size={12} />
              Open
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    Swift: '#f05138',
    Rust: '#dea584',
    Dart: '#0175c2',
  };
  return colors[language] || '#6b7280';
}
