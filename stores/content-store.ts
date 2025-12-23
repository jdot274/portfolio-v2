// Zustand store for managing all content

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentItem, SmartFolder, Tag, ContentType } from '@/types';

interface ContentState {
  items: ContentItem[];
  folders: SmartFolder[];
  tags: Tag[];
  searchQuery: string;
  activeFilter: {
    type?: ContentType;
    tags?: string[];
    folder?: string;
  };
  githubUsername: string;
  githubToken: string | null;
  openaiKey: string | null;
  isLoading: boolean;

  // Actions
  setItems: (items: ContentItem[]) => void;
  addItem: (item: ContentItem) => void;
  updateItem: (id: string, updates: Partial<ContentItem>) => void;
  removeItem: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: Partial<ContentState['activeFilter']>) => void;
  setGithubUsername: (username: string) => void;
  setGithubToken: (token: string | null) => void;
  setOpenaiKey: (key: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  updateItemPosition: (id: string, position: { x: number; y: number }) => void;
  
  // Computed
  getFilteredItems: () => ContentItem[];
  getItemsByFolder: (folderId: string) => ContentItem[];
  getAllTags: () => Tag[];
}

const DEFAULT_FOLDERS: SmartFolder[] = [
  { id: 'all', name: 'All Items', icon: '📚', filter: {}, count: 0 },
  { id: 'projects', name: 'Projects', icon: '📂', filter: { type: ['repo'] }, count: 0 },
  { id: 'webapps', name: 'Web Apps', icon: '🌐', filter: { type: ['webapp', 'website'] }, count: 0 },
  { id: 'snippets', name: 'Snippets', icon: '💻', filter: { type: ['snippet', 'gist'] }, count: 0 },
  { id: 'documents', name: 'Documents', icon: '📄', filter: { type: ['document', 'markdown'] }, count: 0 },
  { id: 'media', name: 'Media', icon: '🖼️', filter: { type: ['image', 'video'] }, count: 0 },
  { id: 'links', name: 'Links', icon: '🔗', filter: { type: ['link'] }, count: 0 },
];

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      items: [],
      folders: DEFAULT_FOLDERS,
      tags: [],
      searchQuery: '',
      activeFilter: {},
      githubUsername: 'jdot274',
      githubToken: null,
      openaiKey: null,
      isLoading: false,

      setItems: (items) => set({ items }),
      
      addItem: (item) => set((state) => ({ 
        items: [item, ...state.items],
        tags: mergeTags(state.tags, item.tags),
      })),
      
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        ),
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setActiveFilter: (filter) => set((state) => ({
        activeFilter: { ...state.activeFilter, ...filter },
      })),
      
      setGithubUsername: (username) => set({ githubUsername: username }),
      
      setGithubToken: (token) => set({ githubToken: token }),
      
      setOpenaiKey: (key) => set({ openaiKey: key }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      updateItemPosition: (id, position) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, position } : item
        ),
      })),

      getFilteredItems: () => {
        const state = get();
        let filtered = state.items;

        // Search filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.tags.some((tag) => tag.name.toLowerCase().includes(query))
          );
        }

        // Type filter
        if (state.activeFilter.type) {
          filtered = filtered.filter((item) => item.type === state.activeFilter.type);
        }

        // Folder filter - handle array of types
        if (state.activeFilter.folder && state.activeFilter.folder !== 'all') {
          const folder = state.folders.find(f => f.id === state.activeFilter.folder);
          if (folder?.filter.type) {
            filtered = filtered.filter((item) => folder.filter.type!.includes(item.type));
          }
        }

        // Tags filter
        if (state.activeFilter.tags && state.activeFilter.tags.length > 0) {
          filtered = filtered.filter((item) =>
            state.activeFilter.tags!.some((tagId) =>
              item.tags.some((tag) => tag.id === tagId)
            )
          );
        }

        return filtered;
      },

      getItemsByFolder: (folderId) => {
        const state = get();
        const folder = state.folders.find((targetFolder) => targetFolder.id === folderId);
        if (!folder || folderId === 'all') return state.items;

        return state.items.filter((item) => {
          if (folder.filter.type && !folder.filter.type.includes(item.type)) {
            return false;
          }
          if (folder.filter.tags) {
            return folder.filter.tags.some((tagId) =>
              item.tags.some((tag) => tag.id === tagId)
            );
          }
          return true;
        });
      },

      getAllTags: () => {
        const state = get();
        const tagMap = new Map<string, Tag>();
        state.items.forEach((item) => {
          item.tags.forEach((tag) => {
            tagMap.set(tag.id, tag);
          });
        });
        return Array.from(tagMap.values());
      },
    }),
    {
      name: 'portfolio-v2-storage',
      partialize: (state) => ({
        items: state.items,
        githubUsername: state.githubUsername,
      }),
    }
  )
);

function mergeTags(existing: Tag[], newTags: Tag[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  existing.forEach((tag) => tagMap.set(tag.id, tag));
  newTags.forEach((tag) => tagMap.set(tag.id, tag));
  return Array.from(tagMap.values());
}
