// Content types for the knowledge management platform

export type ContentType = 
  | 'repo' 
  | 'gist' 
  | 'snippet' 
  | 'document' 
  | 'image' 
  | 'video' 
  | 'link' 
  | 'markdown' 
  | 'file'
  | 'webapp'  // Full web applications
  | 'website'; // Multi-page websites

export type StorageLocation = 'github' | 'google-drive' | 'github-releases' | 'local' | 'external';

export interface Tag {
  id: string;
  name: string;
  color: string;
  aiGenerated?: boolean;
}

export interface WebPage {
  url: string;
  title: string;
  path: string;
}

export interface WebsiteMetadata {
  baseUrl: string;
  pages: WebPage[];
  techStack?: string[];
  framework?: string;
  isDeployed: boolean;
  deploymentUrl?: string;
  screenshot?: string;
  lastCrawled?: string;
}

// Kanban board types
export type BoardColumnId = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | string;

export interface BoardColumn {
  id: BoardColumnId;
  title: string;
  color: string;
  items: string[]; // Content item IDs
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  storageLocation: StorageLocation;
  storagePath?: string;
  tags: Tag[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  // Canvas position (for spatial view)
  position?: { x: number; y: number };
  // Smart folder assignment
  folder?: string;
  // GitHub specific
  github?: {
    owner?: string;
    repo?: string;
    stars?: number;
    language?: string;
    topics?: string[];
  };
  // Website/webapp specific
  website?: WebsiteMetadata;
  // Kanban/project management
  boardColumn?: BoardColumnId;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  checklists?: Checklist[];
  progress?: number; // 0-100
  isPinned?: boolean;
}

export interface SmartFolder {
  id: string;
  name: string;
  icon: string;
  filter: {
    type?: ContentType[];
    tags?: string[];
    query?: string;
  };
  count: number;
}

export interface UploadResult {
  success: boolean;
  item?: ContentItem;
  error?: string;
  storageLocation: StorageLocation;
  url?: string;
}

export interface AITagResult {
  tags: Tag[];
  description: string;
  suggestedFolder?: string;
}

// Widget types
export type WidgetType = 'stats' | 'recent' | 'quick-actions' | 'pinned' | 'activity' | 'progress';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}
