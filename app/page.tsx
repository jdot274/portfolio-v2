'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header 
          className="flex items-center justify-between px-8 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          {/* Search */}
          <div className="glass-input flex items-center gap-3 px-5 py-3 w-[420px]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-ghost)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            />
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-ghost)' }}>
              <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>K</kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={loadGitHubData}
              disabled={isLoading}
              className="glass-button flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync
            </button>
            <button className="button-primary flex items-center gap-2.5 px-6 py-2.5 text-sm font-semibold text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
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
          className="flex items-center justify-between px-8 py-4"
          style={{ 
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-ghost)'
          }}
        >
          <span className="text-xs font-medium">{items.length} items</span>
          <span className="text-xs">@{githubUsername}</span>
        </footer>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Loading...</p>
      </div>
    </div>
  );
}

function DashboardView({ items, onRefresh }: { items: ContentItem[]; onRefresh: () => void }) {
  const repos = items.filter(i => i.type === 'repo');
  const recentItems = [...items].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 6);

  const stats = [
    { label: 'Total Items', value: items.length, delay: 0 },
    { label: 'Repositories', value: repos.length, delay: 0.05 },
    { label: 'Languages', value: new Set(repos.map(r => r.github?.language).filter(Boolean)).size, delay: 0.1 },
    { label: 'Stars', value: repos.reduce((acc, r) => acc + (r.github?.stars || 0), 0), delay: 0.15 },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <GlassCard key={stat.label} delay={stat.delay}>
            <div className="p-6">
              <p className="text-stat">{stat.value}</p>
              <p className="text-stat-label">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-ghost)' }}>
            Recent Activity
          </h3>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-ghost)' }}>
            {recentItems.length} items
          </span>
        </div>
        <div className="space-y-3 stagger-children">
          {recentItems.map((item, i) => (
            <GlassCard key={item.id} delay={0.2 + i * 0.05} href={item.url}>
              <div className="flex items-center gap-5 p-5">
                <div className="icon-shimmer text-2xl">{getContentTypeIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-title truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-subtitle truncate mt-1">{item.description}</p>
                  )}
                </div>
                <span className="text-meta">{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridView({ items }: { items: ContentItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
      {items.map((item, i) => (
        <GlassCard key={item.id} delay={i * 0.03} href={item.url}>
          <div className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-shimmer text-2xl">{getContentTypeIcon(item.type)}</div>
              <h3 className="text-title truncate flex-1">{item.title}</h3>
            </div>
            {item.description && (
              <p className="text-subtitle line-clamp-2 mb-4">{item.description}</p>
            )}
            {item.github && (
              <div className="flex items-center gap-4">
                {item.github.stars > 0 && (
                  <span className="text-meta">⭐ {item.github.stars}</span>
                )}
                {item.github.language && (
                  <span 
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ 
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-tertiary)'
                    }}
                  >
                    {item.github.language}
                  </span>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function ListView({ items }: { items: ContentItem[] }) {
  return (
    <div className="space-y-2 stagger-children">
      {items.map((item, i) => (
        <GlassCard key={item.id} delay={i * 0.02} href={item.url}>
          <div className="flex items-center gap-5 px-5 py-4">
            <div className="icon-shimmer text-xl">{getContentTypeIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-title truncate">{item.title}</p>
            </div>
            {item.github?.language && (
              <span 
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ 
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-tertiary)'
                }}
              >
                {item.github.language}
              </span>
            )}
            <span className="text-meta">{new Date(item.updatedAt).toLocaleDateString()}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// Glass Card with spotlight effect
function GlassCard({ 
  children, 
  delay = 0,
  href 
}: { 
  children: React.ReactNode; 
  delay?: number;
  href?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const content = (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="glass-card"
      onMouseMove={handleMouseMove}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
