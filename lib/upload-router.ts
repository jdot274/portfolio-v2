// Intelligent upload router - automatically routes files to the best storage location

import { ContentType, StorageLocation, UploadResult } from '@/types';

interface FileAnalysis {
  type: ContentType;
  storageLocation: StorageLocation;
  shouldCompress: boolean;
  maxSize: number;
}

const FILE_SIZE_LIMITS = {
  github: 100 * 1024 * 1024, // 100MB
  githubRecommended: 10 * 1024 * 1024, // 10MB for images
  googleDrive: 5 * 1024 * 1024 * 1024, // 5GB
};

const EXTENSION_MAP: Record<string, ContentType> = {
  // Code
  '.ts': 'snippet', '.tsx': 'snippet', '.js': 'snippet', '.jsx': 'snippet',
  '.py': 'snippet', '.swift': 'snippet', '.rs': 'snippet', '.go': 'snippet',
  '.java': 'snippet', '.cpp': 'snippet', '.c': 'snippet', '.h': 'snippet',
  '.css': 'snippet', '.scss': 'snippet', '.html': 'snippet',
  // Documents
  '.md': 'markdown', '.mdx': 'markdown',
  '.pdf': 'document', '.doc': 'document', '.docx': 'document',
  '.txt': 'document', '.rtf': 'document',
  // Images
  '.png': 'image', '.jpg': 'image', '.jpeg': 'image', '.gif': 'image',
  '.webp': 'image', '.svg': 'image', '.ico': 'image',
  // Video
  '.mp4': 'video', '.mov': 'video', '.webm': 'video', '.avi': 'video',
  // Data
  '.json': 'file', '.xml': 'file', '.yaml': 'file', '.yml': 'file',
  '.csv': 'file', '.sql': 'file',
  // Binaries
  '.app': 'file', '.dmg': 'file', '.exe': 'file', '.zip': 'file',
};

export function analyzeFile(file: File): FileAnalysis {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const type = EXTENSION_MAP[ext] || 'file';
  const size = file.size;

  // Determine storage location based on type and size
  let storageLocation: StorageLocation = 'github';
  let shouldCompress = false;

  // Large files go to Google Drive
  if (size > FILE_SIZE_LIMITS.github) {
    storageLocation = 'google-drive';
  }
  // Binary/app files go to GitHub Releases
  else if (['.app', '.dmg', '.exe', '.zip'].includes(ext) && size > 10 * 1024 * 1024) {
    storageLocation = 'github-releases';
  }
  // Large images go to Google Drive
  else if (type === 'image' && size > FILE_SIZE_LIMITS.githubRecommended) {
    storageLocation = 'google-drive';
  }
  // Videos typically go to Google Drive
  else if (type === 'video' && size > 50 * 1024 * 1024) {
    storageLocation = 'google-drive';
  }

  return {
    type,
    storageLocation,
    shouldCompress,
    maxSize: FILE_SIZE_LIMITS[storageLocation === 'google-drive' ? 'googleDrive' : 'github'],
  };
}

export function getStorageIcon(location: StorageLocation): string {
  switch (location) {
    case 'github': return '🐙';
    case 'google-drive': return '📁';
    case 'github-releases': return '📦';
    case 'local': return '💾';
    default: return '📄';
  }
}

export function getContentTypeIcon(type: ContentType): string {
  switch (type) {
    case 'repo': return '📂';
    case 'gist': return '📝';
    case 'snippet': return '💻';
    case 'document': return '📄';
    case 'image': return '🖼️';
    case 'video': return '🎬';
    case 'link': return '🔗';
    case 'markdown': return '📑';
    case 'file': return '📁';
    default: return '📄';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export async function uploadToGitHub(
  file: File,
  path: string,
  token: string,
  owner: string,
  repo: string
): Promise<UploadResult> {
  try {
    const content = await fileToBase64(file);
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${file.name}`,
          content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      storageLocation: 'github',
      url: data.content.html_url,
    };
  } catch (error) {
    return {
      success: false,
      storageLocation: 'github',
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
  });
}

// Placeholder for Google Drive upload (requires OAuth)
export async function uploadToGoogleDrive(
  file: File,
  token: string
): Promise<UploadResult> {
  // This would require Google Drive API setup
  // For now, return a placeholder
  return {
    success: false,
    storageLocation: 'google-drive',
    error: 'Google Drive integration not configured. Please add your Google API credentials.',
  };
}

