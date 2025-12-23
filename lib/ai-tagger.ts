// AI-powered tagging system using OpenAI/Claude API

import { Tag, AITagResult, ContentType } from '@/types';

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
  '#ec4899', '#f43f5e',
];

function getRandomColor(): string {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}

// Generate tags using AI (OpenAI API)
export async function generateTagsWithAI(
  content: string,
  type: ContentType,
  filename: string,
  apiKey?: string
): Promise<AITagResult> {
  // If no API key, fall back to rule-based tagging
  if (!apiKey) {
    return generateTagsLocally(content, type, filename);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a content tagger. Analyze the content and return JSON with:
- tags: array of 3-5 relevant tags (lowercase, hyphenated)
- description: one sentence summary
- suggestedFolder: one of [projects, snippets, documents, media, resources]

Respond ONLY with valid JSON.`
          },
          {
            role: 'user',
            content: `File: ${filename}\nType: ${type}\nContent preview:\n${content.slice(0, 1000)}`
          }
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('AI API error');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      tags: result.tags.map((name: string) => ({
        id: `tag-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        color: getRandomColor(),
        aiGenerated: true,
      })),
      description: result.description,
      suggestedFolder: result.suggestedFolder,
    };
  } catch (error) {
    console.error('AI tagging failed, using local:', error);
    return generateTagsLocally(content, type, filename);
  }
}

// Local rule-based tagging (fallback when no API key)
export function generateTagsLocally(
  content: string,
  type: ContentType,
  filename: string
): AITagResult {
  const tags: Tag[] = [];
  const lowerContent = content.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  // Type-based tags
  tags.push({
    id: `tag-type-${type}`,
    name: type,
    color: getRandomColor(),
    aiGenerated: false,
  });

  // Language detection
  const languagePatterns: Record<string, string[]> = {
    'typescript': ['.ts', '.tsx', 'interface ', 'type '],
    'javascript': ['.js', '.jsx', 'const ', 'function '],
    'python': ['.py', 'def ', 'import ', 'class '],
    'swift': ['.swift', 'func ', 'struct ', 'class '],
    'rust': ['.rs', 'fn ', 'impl ', 'pub '],
    'react': ['react', 'usestate', 'useeffect', '<component'],
    'nextjs': ['next', 'getstaticprops', 'getserverside'],
    'tailwind': ['tailwind', 'className='],
  };

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    if (patterns.some(p => lowerFilename.includes(p) || lowerContent.includes(p))) {
      tags.push({
        id: `tag-lang-${lang}`,
        name: lang,
        color: getRandomColor(),
        aiGenerated: false,
      });
    }
  }

  // Topic detection
  const topicPatterns: Record<string, string[]> = {
    'api': ['api', 'endpoint', 'fetch', 'axios'],
    'database': ['database', 'sql', 'mongodb', 'prisma'],
    'ui': ['component', 'button', 'modal', 'form'],
    'auth': ['auth', 'login', 'password', 'jwt'],
    'ai': ['openai', 'gpt', 'claude', 'llm', 'ml'],
    'desktop': ['electron', 'tauri', 'native', 'macos'],
    'mobile': ['ios', 'android', 'react-native', 'flutter'],
  };

  for (const [topic, patterns] of Object.entries(topicPatterns)) {
    if (patterns.some(p => lowerContent.includes(p))) {
      tags.push({
        id: `tag-topic-${topic}`,
        name: topic,
        color: getRandomColor(),
        aiGenerated: false,
      });
    }
  }

  // Limit to 5 tags
  const finalTags = tags.slice(0, 5);

  // Generate description
  const description = `${type.charAt(0).toUpperCase() + type.slice(1)} file: ${filename}`;

  // Suggest folder
  let suggestedFolder = 'resources';
  if (type === 'repo') suggestedFolder = 'projects';
  else if (type === 'snippet' || type === 'gist') suggestedFolder = 'snippets';
  else if (type === 'document' || type === 'markdown') suggestedFolder = 'documents';
  else if (type === 'image' || type === 'video') suggestedFolder = 'media';

  return { tags: finalTags, description, suggestedFolder };
}

// Extract text content from various file types
export async function extractTextContent(file: File): Promise<string> {
  const type = file.type;
  
  if (type.startsWith('text/') || 
      file.name.endsWith('.md') || 
      file.name.endsWith('.json') ||
      file.name.endsWith('.ts') ||
      file.name.endsWith('.tsx') ||
      file.name.endsWith('.js') ||
      file.name.endsWith('.jsx') ||
      file.name.endsWith('.py') ||
      file.name.endsWith('.swift') ||
      file.name.endsWith('.rs')) {
    return await file.text();
  }
  
  // For other types, just use the filename
  return file.name;
}

