'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { ViewMode } from '@/components/Sidebar';
import { useContentStore } from '@/stores/content-store';
import { fetchUserRepos, fetchUserGists, repoToContentItem, gistToContentItem } from '@/lib/github-api';
import { ContentItem } from '@/types';
import { getContentTypeIcon } from '@/lib/upload-router';

export default function Home() {
  const {
    items,
    githubUsername,
    githubToken,
    isLoading,
    setItems,
    setIsLoading,
    getFilteredItems,
  } = useContentStore();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  useEffect(() => {
    if (items.length === 0) {
      loadGitHubData();
    }
  }, []);

  const loadGitHubData = async () => {
    setIsLoading(true);
    try {
      const [repos, gists] = await Promise.all([
        fetchUserRepos(githubUsername, githubToken || undefined),
        fetchUserGists(githubUsername, githubToken || undefined).catch(() => []),
      ]);
      setItems([...repos.map(repoToContentItem), ...gists.map(gistToContentItem)]);
    } catch (error) {
      console.error('Failed to load GitHub data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="flex h-screen" style={{ background: 'var(--color-base)' }}>
      <Sidebar viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          {/* Search */}
          <div 
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-96 transition-all duration-200"
            style={{ 
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--color-text)' }}
            />
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadGitHubData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 disabled:opacity-50"
              style={{ 
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ 
                background: 'var(--color-accent)',
                color: 'white',
                boxShadow: '0 0 20px var(--color-accent-glow)'
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <LoadingState />
          ) : viewMode === 'dashboard' ? (
            <DashboardView items={filteredItems} onRefresh={loadGitHubData} />
          ) : viewMode === 'grid' ? (
            <GridView items={filteredItems} />
          ) : viewMode === 'list' ? (
            <ListView items={filteredItems} />
          ) : null}
        </div>

        {/* Footer */}
        <footer 
          className="flex items-center justify-between px-6 py-3 text-xs"
          style={{ 
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)'
          }}
        >
          <span>{items.length} items</span>
          <span>@{githubUsername}</span>
        </footer>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div 
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </div>
    </div>
  );
}

function DashboardView({ items, onRefresh }: { items: ContentItem[]; onRefresh: () => void }) {
  const repos = items.filter(i => i.type === 'repo');
  const recentItems = [...items].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: items.length },
          { label: 'Repositories', value: repos.length },
          { label: 'Languages', value: new Set(repos.map(r => r.github?.language).filter(Boolean)).size },
          { label: 'Stars', value: repos.reduce((acc, r) => acc + (r.github?.stars || 0), 0) },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel-subtle p-5"
          >
            <p className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent */}
      <div className="glass-panel-subtle overflow-hidden">
        <div 
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <h3 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            Recent Activity
          </h3>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {recentItems.length} items
          </span>
        </div>
        <div>
          {recentItems.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-5 py-3.5 transition-all duration-150"
              style={{ 
                borderBottom: i < recentItems.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                color: 'var(--color-text)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-lg">{getContentTypeIcon(item.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                {item.description && (
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {item.description}
                  </p>
                )}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridView({ items }: { items: ContentItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02 }}
          className="glass-panel-subtle p-4 hover-lift block"
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-lg">{getContentTypeIcon(item.type)}</span>
            <h3 className="text-sm font-medium truncate flex-1" style={{ color: 'var(--color-text)' }}>
              {item.title}
            </h3>
          </div>
          {item.description && (
            <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-text-muted)' }}>
              {item.description}
            </p>
          )}
          {item.github && (
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
              {item.github.stars > 0 && <span>⭐ {item.github.stars}</span>}
              {item.github.language && <span>{item.github.language}</span>}
            </div>
          )}
        </motion.a>
      ))}
    </div>
  );
}

function ListView({ items }: { items: ContentItem[] }) {
  return (
    <div className="glass-panel-subtle overflow-hidden">
      {items.map((item, i) => (
        <motion.a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.01 }}
          className="flex items-center gap-4 px-5 py-3.5 transition-all duration-150"
          style={{ 
            borderBottom: i < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
            color: 'var(--color-text)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span className="text-lg">{getContentTypeIcon(item.type)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
          </div>
          {item.github?.language && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ 
              background: 'var(--color-surface)',
              color: 'var(--color-text-muted)'
            }}>
              {item.github.language}
            </span>
          )}
          <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
