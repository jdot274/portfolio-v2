'use client';

import { useState } from 'react';
import { 
  TrendingUp, Clock, Zap, Pin, Activity, BarChart3,
  FolderOpen, Github, Globe, FileCode, Image, Link2,
  Plus, ArrowRight, Star, GitFork, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useContentStore } from '@/stores/content-store';
import { ContentItem } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';

// Stats Widget
export function StatsWidget() {
  const { items } = useContentStore();

  const stats = [
    { 
      label: 'Total Items', 
      value: items.length, 
      icon: <FolderOpen size={16} />,
      color: '#10b981',
    },
    { 
      label: 'Repositories', 
      value: items.filter(item => item.type === 'repo').length, 
      icon: <Github size={16} />,
      color: '#3b82f6',
    },
    { 
      label: 'Web Apps', 
      value: items.filter(item => item.type === 'webapp' || item.type === 'website').length, 
      icon: <Globe size={16} />,
      color: '#8b5cf6',
    },
    { 
      label: 'Documents', 
      value: items.filter(item => item.type === 'document' || item.type === 'markdown').length, 
      icon: <FileCode size={16} />,
      color: '#f97316',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, statIndex) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: statIndex * 0.05 }}
          className="rounded-xl p-4"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stat.value}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Recent Items Widget
export function RecentWidget({ onItemClick }: { onItemClick?: (item: ContentItem) => void }) {
  const { items } = useContentStore();

  const recentItems = [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div 
        className="flex items-center justify-between p-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
          <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Recent Activity</h3>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{recentItems.length} items</span>
      </div>
      <div>
        {recentItems.map((item, index) => (
          <motion.button
            key={item.id}
            whileHover={{ backgroundColor: 'var(--color-surface-hover)' }}
            onClick={() => onItemClick?.(item)}
            className="w-full flex items-center gap-3 p-3 text-left"
            style={{ borderBottom: index < recentItems.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}
          >
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: 'var(--color-text)' }}>{item.title}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
            {item.url && (
              <ExternalLink size={14} style={{ color: 'var(--color-text-subtle)' }} />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Quick Actions Widget
export function QuickActionsWidget({ 
  onNewDoc, 
  onUpload, 
  onCaptureWebsite,
  onSyncGithub 
}: { 
  onNewDoc: () => void;
  onUpload: () => void;
  onCaptureWebsite: () => void;
  onSyncGithub: () => void;
}) {
  const actions = [
    { label: 'New Document', icon: <FileCode size={18} />, onClick: onNewDoc, color: '#3b82f6' },
    { label: 'Upload File', icon: <Plus size={18} />, onClick: onUpload, color: '#10b981' },
    { label: 'Capture Website', icon: <Globe size={18} />, onClick: onCaptureWebsite, color: '#8b5cf6' },
    { label: 'Sync GitHub', icon: <Github size={18} />, onClick: onSyncGithub, color: '#f97316' },
  ];

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div 
        className="flex items-center gap-2 p-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <Zap size={16} style={{ color: '#eab308' }} />
        <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="flex items-center gap-2 p-3 rounded-lg text-sm transition-colors"
            style={{ 
              backgroundColor: 'var(--color-layer2)',
              color: 'var(--color-text)'
            }}
          >
            <span 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: action.color, color: 'white' }}
            >
              {action.icon}
            </span>
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Pinned Items Widget
export function PinnedWidget({ onItemClick }: { onItemClick?: (item: ContentItem) => void }) {
  const { items, updateItem } = useContentStore();
  const pinnedItems = items.filter(item => item.isPinned);

  if (pinnedItems.length === 0) {
    return (
      <div 
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <Pin size={24} className="mx-auto mb-2" style={{ color: 'var(--color-text-subtle)' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No pinned items</p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-subtle)' }}>Pin important items for quick access</p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div 
        className="flex items-center gap-2 p-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <Pin size={16} style={{ color: '#eab308' }} />
        <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Pinned</h3>
      </div>
      <div>
        {pinnedItems.map((item, index) => (
          <motion.button
            key={item.id}
            whileHover={{ backgroundColor: 'var(--color-surface-hover)' }}
            onClick={() => onItemClick?.(item)}
            className="w-full flex items-center gap-3 p-3 text-left group"
            style={{ borderBottom: index < pinnedItems.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}
          >
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: 'var(--color-text)' }}>{item.title}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateItem(item.id, { isPinned: false });
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Pin size={12} />
            </button>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// GitHub Stats Widget
export function GitHubStatsWidget() {
  const { items, githubUsername } = useContentStore();
  const repos = items.filter(item => item.type === 'repo');
  
  const totalStars = repos.reduce((acc, repo) => acc + (repo.github?.stars || 0), 0);
  const languages = new Set(repos.map(repo => repo.github?.language).filter(Boolean));
  const topRepo = repos.sort((a, b) => (b.github?.stars || 0) - (a.github?.stars || 0))[0];

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div 
        className="flex items-center gap-2 p-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <Github size={16} style={{ color: 'var(--color-text)' }} />
        <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>GitHub Overview</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>@{githubUsername}</span>
          <a 
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            View Profile →
          </a>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{repos.length}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Repos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{totalStars}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Stars</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{languages.size}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Languages</p>
          </div>
        </div>

        {topRepo && (
          <div className="pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Top Repository</p>
            <a
              href={topRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-layer2)' }}
            >
              <span>📂</span>
              <span className="text-sm flex-1 truncate" style={{ color: 'var(--color-text)' }}>{topRepo.title}</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#eab308' }}>
                <Star size={12} /> {topRepo.github?.stars}
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Progress Widget (for board items)
export function ProgressWidget() {
  const { items } = useContentStore();
  const boardItems = items.filter(item => item.boardColumn);

  const columns = [
    { id: 'backlog', label: 'Backlog', color: '#6b7280' },
    { id: 'todo', label: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { id: 'review', label: 'Review', color: '#8b5cf6' },
    { id: 'done', label: 'Done', color: '#22c55e' },
  ];

  const getColumnCount = (id: string) => boardItems.filter(item => item.boardColumn === id).length;
  const total = boardItems.length || 1;

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div 
        className="flex items-center gap-2 p-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <BarChart3 size={16} style={{ color: '#10b981' }} />
        <h3 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Board Progress</h3>
      </div>
      <div className="p-4 space-y-3">
        {/* Progress bar */}
        <div 
          className="h-2 rounded-full overflow-hidden flex"
          style={{ backgroundColor: 'var(--color-layer2)' }}
        >
          {columns.map((col) => {
            const count = getColumnCount(col.id);
            const width = (count / total) * 100;
            return (
              <div
                key={col.id}
                style={{ width: `${width}%`, backgroundColor: col.color }}
                className="transition-all duration-300"
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-5 gap-1">
          {columns.map((col) => (
            <div key={col.id} className="text-center">
              <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{getColumnCount(col.id)}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{col.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
