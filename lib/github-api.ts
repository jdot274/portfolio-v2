// GitHub API integration for fetching repos, gists, and managing content

import { ContentItem, Tag } from '@/types';

const GITHUB_API = 'https://api.github.com';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubGist {
  id: string;
  description: string | null;
  html_url: string;
  files: Record<string, { filename: string; language: string; size: number; raw_url: string }>;
  created_at: string;
  updated_at: string;
  public: boolean;
}

// Fetch all repos for a user
export async function fetchUserRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.status}`);
  }

  return response.json();
}

// Fetch all gists for a user
export async function fetchUserGists(username: string, token?: string): Promise<GitHubGist[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${GITHUB_API}/users/${username}/gists?per_page=100`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch gists: ${response.status}`);
  }

  return response.json();
}

// Convert GitHub repo to ContentItem
export function repoToContentItem(repo: GitHubRepo): ContentItem {
  const tags: Tag[] = [
    ...(repo.language ? [{
      id: `lang-${repo.language.toLowerCase()}`,
      name: repo.language.toLowerCase(),
      color: getLanguageColor(repo.language),
      aiGenerated: false,
    }] : []),
    ...repo.topics.slice(0, 3).map(topic => ({
      id: `topic-${topic}`,
      name: topic,
      color: '#6366f1',
      aiGenerated: false,
    })),
  ];

  return {
    id: `repo-${repo.id}`,
    type: 'repo',
    title: repo.name,
    description: repo.description || undefined,
    url: repo.html_url,
    storageLocation: 'github',
    storagePath: repo.full_name,
    tags,
    metadata: {
      homepage: repo.homepage,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    },
    createdAt: repo.updated_at,
    updatedAt: repo.updated_at,
    github: {
      owner: repo.owner.login,
      repo: repo.name,
      stars: repo.stargazers_count,
      language: repo.language || undefined,
      topics: repo.topics,
    },
  };
}

// Convert GitHub gist to ContentItem
export function gistToContentItem(gist: GitHubGist): ContentItem {
  const files = Object.values(gist.files);
  const primaryFile = files[0];
  
  const tags: Tag[] = files.map(f => ({
    id: `gist-file-${f.filename}`,
    name: f.language?.toLowerCase() || 'text',
    color: getLanguageColor(f.language || 'text'),
    aiGenerated: false,
  })).slice(0, 3);

  return {
    id: `gist-${gist.id}`,
    type: 'gist',
    title: gist.description || primaryFile?.filename || 'Untitled Gist',
    description: `${files.length} file${files.length > 1 ? 's' : ''}: ${files.map(f => f.filename).join(', ')}`,
    url: gist.html_url,
    storageLocation: 'github',
    storagePath: gist.id,
    tags,
    metadata: {
      files: files.map(f => ({ name: f.filename, language: f.language, size: f.size })),
      public: gist.public,
    },
    createdAt: gist.created_at,
    updatedAt: gist.updated_at,
  };
}

// Get color for programming language
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    typescript: '#3178c6',
    javascript: '#f7df1e',
    python: '#3776ab',
    swift: '#f05138',
    rust: '#dea584',
    go: '#00add8',
    java: '#b07219',
    'c++': '#f34b7d',
    c: '#555555',
    ruby: '#cc342d',
    php: '#4f5d95',
    html: '#e34f26',
    css: '#1572b6',
    dart: '#0175c2',
  };
  return colors[language.toLowerCase()] || '#6b7280';
}

// Create a new gist
export async function createGist(
  description: string,
  files: Record<string, string>,
  isPublic: boolean,
  token: string
): Promise<GitHubGist> {
  const response = await fetch(`${GITHUB_API}/gists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      public: isPublic,
      files: Object.fromEntries(
        Object.entries(files).map(([name, content]) => [name, { content }])
      ),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create gist: ${response.status}`);
  }

  return response.json();
}

// Get file content from a repo
export async function getRepoFileContent(
  owner: string,
  repo: string,
  path: string,
  token?: string
): Promise<string> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3.raw',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }

  return response.text();
}

