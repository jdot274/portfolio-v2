// Website and webapp capture utilities

import { ContentItem, WebPage, WebsiteMetadata, Tag } from '@/types';

// Detect framework/tech stack from URL or HTML
export function detectTechStack(html: string, url: string): string[] {
  const stack: string[] = [];
  const lowerHtml = html.toLowerCase();

  // Frameworks
  if (lowerHtml.includes('__next') || lowerHtml.includes('_next/static')) stack.push('Next.js');
  if (lowerHtml.includes('__nuxt') || lowerHtml.includes('/_nuxt/')) stack.push('Nuxt');
  if (lowerHtml.includes('ng-version') || lowerHtml.includes('ng-app')) stack.push('Angular');
  if (lowerHtml.includes('data-reactroot') || lowerHtml.includes('__react')) stack.push('React');
  if (lowerHtml.includes('data-v-') || lowerHtml.includes('vue')) stack.push('Vue');
  if (lowerHtml.includes('svelte')) stack.push('Svelte');
  if (lowerHtml.includes('astro')) stack.push('Astro');

  // Platforms
  if (url.includes('vercel.app')) stack.push('Vercel');
  if (url.includes('netlify.app')) stack.push('Netlify');
  if (url.includes('github.io')) stack.push('GitHub Pages');
  if (url.includes('railway.app')) stack.push('Railway');
  if (url.includes('render.com')) stack.push('Render');

  // CSS
  if (lowerHtml.includes('tailwind')) stack.push('Tailwind');
  if (lowerHtml.includes('chakra')) stack.push('Chakra UI');
  if (lowerHtml.includes('mui') || lowerHtml.includes('material-ui')) stack.push('Material UI');

  return stack;
}

// Extract page routes from a webapp
export async function extractRoutes(baseUrl: string): Promise<WebPage[]> {
  const pages: WebPage[] = [];
  
  try {
    // Fetch the main page
    const response = await fetch(baseUrl);
    const html = await response.text();
    
    // Add the home page
    pages.push({
      url: baseUrl,
      title: extractTitle(html) || 'Home',
      path: '/',
    });

    // Extract internal links
    const linkRegex = /href=["']([^"']+)["']/g;
    const matches = html.matchAll(linkRegex);
    const baseHost = new URL(baseUrl).host;
    const seenPaths = new Set<string>(['/']);

    for (const match of matches) {
      try {
        const href = match[1];
        
        // Skip external links, anchors, and assets
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
        if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(href)) continue;
        
        let fullUrl: URL;
        if (href.startsWith('http')) {
          fullUrl = new URL(href);
          if (fullUrl.host !== baseHost) continue;
        } else if (href.startsWith('/')) {
          fullUrl = new URL(href, baseUrl);
        } else {
          continue;
        }

        const path = fullUrl.pathname;
        if (!seenPaths.has(path) && path !== '/') {
          seenPaths.add(path);
          pages.push({
            url: fullUrl.toString(),
            title: path.split('/').pop()?.replace(/-/g, ' ') || path,
            path,
          });
        }
      } catch {
        // Invalid URL, skip
      }
    }

    return pages.slice(0, 20); // Limit to 20 pages
  } catch (error) {
    console.error('Failed to extract routes:', error);
    return pages;
  }
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

// Generate tags for a website
export function generateWebsiteTags(metadata: WebsiteMetadata): Tag[] {
  const tags: Tag[] = [];
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6'];
  let colorIndex = 0;

  // Add type tag
  tags.push({
    id: 'type-webapp',
    name: metadata.pages.length > 1 ? 'multi-page' : 'single-page',
    color: colors[colorIndex++ % colors.length],
  });

  // Add tech stack tags
  metadata.techStack?.forEach(tech => {
    tags.push({
      id: `tech-${tech.toLowerCase().replace(/\s+/g, '-')}`,
      name: tech.toLowerCase(),
      color: colors[colorIndex++ % colors.length],
    });
  });

  // Add deployment tag
  if (metadata.isDeployed) {
    tags.push({
      id: 'deployed',
      name: 'deployed',
      color: '#22c55e',
    });
  }

  return tags.slice(0, 5);
}

// Capture a website/webapp
export async function captureWebsite(url: string): Promise<{
  metadata: WebsiteMetadata;
  tags: Tag[];
  title: string;
  description: string;
}> {
  // Normalize URL
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  try {
    // Fetch and analyze
    const response = await fetch(normalizedUrl);
    const html = await response.text();
    
    // Extract data
    const title = extractTitle(html) || new URL(normalizedUrl).hostname;
    const techStack = detectTechStack(html, normalizedUrl);
    const pages = await extractRoutes(normalizedUrl);
    
    // Detect framework
    const framework = techStack.find(tech => 
      ['Next.js', 'Nuxt', 'React', 'Vue', 'Angular', 'Svelte', 'Astro'].includes(tech)
    );

    const metadata: WebsiteMetadata = {
      baseUrl: normalizedUrl,
      pages,
      techStack,
      framework,
      isDeployed: true,
      deploymentUrl: normalizedUrl,
      lastCrawled: new Date().toISOString(),
    };

    const tags = generateWebsiteTags(metadata);

    // Generate description
    const description = `${framework || 'Web'} app with ${pages.length} page${pages.length !== 1 ? 's' : ''}${techStack.length > 0 ? `. Built with ${techStack.slice(0, 3).join(', ')}` : ''}`;

    return { metadata, tags, title, description };
  } catch (error) {
    throw new Error(`Failed to capture website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create a content item from captured website
export function createWebsiteItem(
  url: string,
  metadata: WebsiteMetadata,
  tags: Tag[],
  title: string,
  description: string
): ContentItem {
  return {
    id: `webapp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: metadata.pages.length > 1 ? 'webapp' : 'website',
    title,
    description,
    url,
    storageLocation: 'external',
    tags,
    metadata: {
      pageCount: metadata.pages.length,
      techStack: metadata.techStack,
      framework: metadata.framework,
    },
    website: metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folder: 'projects',
  };
}

