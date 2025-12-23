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
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Repositories', 
      value: items.filter(i => i.type === 'repo').length, 
      icon: <Github size={16} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Web Apps', 
      value: items.filter(i => i.type === 'webapp' || i.type === 'website').length, 
      icon: <Globe size={16} />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Documents', 
      value: items.filter(i => i.type === 'document' || i.type === 'markdown').length, 
      icon: <FileCode size={16} />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
        >
          <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.color} mb-3`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-zinc-500">{stat.label}</p>
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-zinc-500" />
          <h3 className="font-medium text-white text-sm">Recent Activity</h3>
        </div>
        <span className="text-xs text-zinc-500">{recentItems.length} items</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {recentItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            onClick={() => onItemClick?.(item)}
            className="w-full flex items-center gap-3 p-3 text-left"
          >
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{item.title}</p>
              <p className="text-xs text-zinc-500">
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
            {item.url && (
              <ExternalLink size={14} className="text-zinc-600" />
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
    { label: 'New Document', icon: <FileCode size={18} />, onClick: onNewDoc, color: 'bg-blue-500' },
    { label: 'Upload File', icon: <Plus size={18} />, onClick: onUpload, color: 'bg-emerald-500' },
    { label: 'Capture Website', icon: <Globe size={18} />, onClick: onCaptureWebsite, color: 'bg-purple-500' },
    { label: 'Sync GitHub', icon: <Github size={18} />, onClick: onSyncGithub, color: 'bg-orange-500' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <Zap size={16} className="text-yellow-500" />
        <h3 className="font-medium text-white text-sm">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm"
          >
            <span className={`p-1.5 rounded-md ${action.color}`}>
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
  const pinnedItems = items.filter(i => i.isPinned);

  if (pinnedItems.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
        <Pin size={24} className="text-zinc-600 mx-auto mb-2" />
        <p className="text-sm text-zinc-500">No pinned items</p>
        <p className="text-xs text-zinc-600 mt-1">Pin important items for quick access</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <Pin size={16} className="text-yellow-500" />
        <h3 className="font-medium text-white text-sm">Pinned</h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {pinnedItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            onClick={() => onItemClick?.(item)}
            className="w-full flex items-center gap-3 p-3 text-left group"
          >
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{item.title}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateItem(item.id, { isPinned: false });
              }}
              className="p-1 rounded hover:bg-zinc-700 text-zinc-500 opacity-0 group-hover:opacity-100"
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
  const repos = items.filter(i => i.type === 'repo');
  
  const totalStars = repos.reduce((acc, r) => acc + (r.github?.stars || 0), 0);
  const languages = new Set(repos.map(r => r.github?.language).filter(Boolean));
  const topRepo = repos.sort((a, b) => (b.github?.stars || 0) - (a.github?.stars || 0))[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <Github size={16} className="text-white" />
        <h3 className="font-medium text-white text-sm">GitHub Overview</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">@{githubUsername}</span>
          <a 
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-500 hover:text-emerald-400"
          >
            View Profile →
          </a>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{repos.length}</p>
            <p className="text-xs text-zinc-500">Repos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{totalStars}</p>
            <p className="text-xs text-zinc-500">Stars</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{languages.size}</p>
            <p className="text-xs text-zinc-500">Languages</p>
          </div>
        </div>

        {topRepo && (
          <div className="pt-3 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-2">Top Repository</p>
            <a
              href={topRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
            >
              <span>📂</span>
              <span className="text-sm text-white flex-1 truncate">{topRepo.title}</span>
              <span className="flex items-center gap-1 text-xs text-yellow-500">
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
  const boardItems = items.filter(i => i.boardColumn);

  const columns = [
    { id: 'backlog', label: 'Backlog', color: '#6b7280' },
    { id: 'todo', label: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { id: 'review', label: 'Review', color: '#8b5cf6' },
    { id: 'done', label: 'Done', color: '#22c55e' },
  ];

  const getColumnCount = (id: string) => boardItems.filter(i => i.boardColumn === id).length;
  const total = boardItems.length || 1;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <BarChart3 size={16} className="text-emerald-500" />
        <h3 className="font-medium text-white text-sm">Board Progress</h3>
      </div>
      <div className="p-4 space-y-3">
        {/* Progress bar */}
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
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
              <p className="text-lg font-bold text-white">{getColumnCount(col.id)}</p>
              <p className="text-[10px] text-zinc-500">{col.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

