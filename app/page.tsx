'use client';

import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Github, FileCode, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { ViewMode } from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import ContentCard from '@/components/ContentCard';
import CanvasView from '@/components/CanvasView';
import KanbanBoard from '@/components/KanbanBoard';
import UploadDropzone from '@/components/UploadDropzone';
import MarkdownEditor from '@/components/MarkdownEditor';
import WebsiteCapture from '@/components/WebsiteCapture';
import CardDetailModal from '@/components/CardDetailModal';
import { 
  StatsWidget, 
  RecentWidget, 
  QuickActionsWidget, 
  PinnedWidget,
  GitHubStatsWidget,
  ProgressWidget 
} from '@/components/Widgets';
import { useContentStore } from '@/stores/content-store';
import { fetchUserRepos, fetchUserGists, repoToContentItem, gistToContentItem } from '@/lib/github-api';
import { ContentItem } from '@/types';

export default function Home() {
  const {
    items,
    githubUsername,
    githubToken,
    isLoading,
    setItems,
    setIsLoading,
    getFilteredItems,
    removeItem,
  } = useContentStore();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showUpload, setShowUpload] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showWebsiteCapture, setShowWebsiteCapture] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Fetch GitHub data on mount
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

      const repoItems = repos.map(repoToContentItem);
      const gistItems = gists.map(gistToContentItem);

      setItems([...repoItems, ...gistItems]);
    } catch (error) {
      console.error('Failed to load GitHub data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = getFilteredItems();

  const handleEditItem = (item: ContentItem) => {
    setSelectedItem(item);
    setShowCardDetail(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      removeItem(id);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-emerald-500 animate-spin" />
            <p className="text-sm text-zinc-500">Loading from GitHub...</p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'dashboard':
        return (
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Stats Row */}
            <StatsWidget />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <QuickActionsWidget
                  onNewDoc={() => setShowEditor(true)}
                  onUpload={() => setShowUpload(true)}
                  onCaptureWebsite={() => setShowWebsiteCapture(true)}
                  onSyncGithub={loadGitHubData}
                />

                {/* Board Progress */}
                <ProgressWidget />

                {/* Recent Items */}
                <RecentWidget onItemClick={handleEditItem} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Pinned */}
                <PinnedWidget onItemClick={handleEditItem} />

                {/* GitHub Stats */}
                <GitHubStatsWidget />
              </div>
            </div>
          </div>
        );

      case 'canvas':
        return <CanvasView />;

      case 'board':
        return <KanbanBoard onEditItem={handleEditItem} />;

      case 'grid':
        return (
          <div className="h-full overflow-y-auto p-6">
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        );

      case 'list':
        return (
          <div className="h-full overflow-y-auto p-6">
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <ListItem 
                      key={item.id} 
                      item={item} 
                      onClick={() => handleEditItem(item)} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <Sidebar viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            {/* Refresh */}
            <button
              onClick={loadGitHubData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span className="text-sm hidden md:inline">Sync</span>
            </button>

            {/* Capture Website */}
            <button
              onClick={() => setShowWebsiteCapture(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            >
              <Globe size={16} />
              <span className="text-sm hidden md:inline">Website</span>
            </button>

            {/* New document */}
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            >
              <FileCode size={16} />
              <span className="text-sm hidden md:inline">Doc</span>
            </button>

            {/* Upload */}
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Plus size={16} />
              <span className="text-sm">Upload</span>
            </button>
          </div>
        </header>

        {/* Upload dropzone */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-zinc-800"
            >
              <div className="p-4">
                <UploadDropzone onUploadComplete={() => setShowUpload(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        {/* Stats footer */}
        <footer className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>{items.length} items</span>
            <span>•</span>
            <span>{items.filter(i => i.type === 'repo').length} repos</span>
            <span>•</span>
            <span>{items.filter(i => i.type === 'webapp' || i.type === 'website').length} webapps</span>
            <span>•</span>
            <span>{items.filter(i => i.type === 'gist').length} gists</span>
          </div>
          <div className="flex items-center gap-2">
            <Github size={14} />
            <span>{githubUsername}</span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <MarkdownEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
      />

      <WebsiteCapture
        isOpen={showWebsiteCapture}
        onClose={() => setShowWebsiteCapture(false)}
      />

      <CardDetailModal
        item={selectedItem}
        isOpen={showCardDetail}
        onClose={() => {
          setShowCardDetail(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
        <Github size={32} className="text-zinc-600" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
      <p className="text-sm text-zinc-500 max-w-sm">
        Upload files, create documents, capture websites, or sync your GitHub repos.
      </p>
    </div>
  );
}

function ListItem({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 text-left"
    >
      <span className="text-xl">{getTypeIcon(item.type)}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-zinc-500 truncate">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {item.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.id}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>
      {item.url && (
        <span className="text-xs text-emerald-500">Open →</span>
      )}
    </motion.button>
  );
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    repo: '📂',
    gist: '📝',
    snippet: '💻',
    document: '📄',
    image: '🖼️',
    video: '🎬',
    link: '🔗',
    markdown: '📑',
    file: '📁',
    webapp: '🌐',
    website: '🌍',
  };
  return icons[type] || '📄';
}
