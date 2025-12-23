// Professional Theme System - Inspired by ChatGPT, Linear, Vercel, shadcn

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Base layers (darkest to lightest)
    base: string;
    layer1: string;
    layer2: string;
    layer3: string;
    layer4: string;
    
    // Surfaces
    surface: string;
    surfaceHover: string;
    surfaceActive: string;
    
    // Borders
    border: string;
    borderSubtle: string;
    borderStrong: string;
    
    // Text
    text: string;
    textMuted: string;
    textSubtle: string;
    
    // Accent
    accent: string;
    accentMuted: string;
    accentHover: string;
    
    // Semantic
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Gradients & Effects
    gradient?: string;
    glow?: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    glow: string;
  };
}

export const themes: Record<string, Theme> = {
  // Grey Silver Layered - Professional & Clean
  'grey-silver': {
    id: 'grey-silver',
    name: 'Grey Silver',
    description: 'Professional grey with silver accents and depth layers',
    colors: {
      base: '#0a0a0a',
      layer1: '#111111',
      layer2: '#1a1a1a',
      layer3: '#242424',
      layer4: '#2e2e2e',
      surface: '#161616',
      surfaceHover: '#1c1c1c',
      surfaceActive: '#222222',
      border: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.04)',
      borderStrong: 'rgba(255, 255, 255, 0.15)',
      text: '#f4f4f5',
      textMuted: '#a1a1aa',
      textSubtle: '#71717a',
      accent: '#a1a1aa',
      accentMuted: 'rgba(161, 161, 170, 0.15)',
      accentHover: '#d4d4d8',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      glow: '0 0 40px rgba(255, 255, 255, 0.03)',
    },
    fonts: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
    },
    radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px' },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(255, 255, 255, 0.03)',
    },
  },

  // ChatGPT Style - Based on NextChat research
  'chatgpt': {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Clean dark theme inspired by ChatGPT',
    colors: {
      base: 'rgb(21, 21, 21)',
      layer1: 'rgb(30, 30, 30)',
      layer2: 'rgb(39, 39, 39)',
      layer3: 'rgb(50, 50, 50)',
      layer4: 'rgb(64, 64, 64)',
      surface: 'rgb(30, 30, 30)',
      surfaceHover: '#323232',
      surfaceActive: 'rgb(39, 39, 39)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderSubtle: 'rgba(255, 255, 255, 0.05)',
      borderStrong: 'rgba(255, 255, 255, 0.2)',
      text: 'rgb(236, 236, 236)',
      textMuted: 'rgb(187, 187, 187)',
      textSubtle: 'rgb(142, 142, 142)',
      accent: 'rgb(29, 147, 171)',
      accentMuted: 'rgba(29, 147, 171, 0.15)',
      accentHover: 'rgb(45, 170, 195)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: 'rgb(29, 147, 171)',
    },
    fonts: {
      sans: '"Söhne", "Noto Sans", "SF Pro Text", -apple-system, sans-serif',
      mono: '"Söhne Mono", "SF Mono", "Fira Code", monospace',
    },
    radius: { sm: '6px', md: '10px', lg: '14px', xl: '20px' },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
      md: '0 4px 8px rgba(0, 0, 0, 0.25)',
      lg: '50px 50px 100px 10px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(29, 147, 171, 0.15)',
    },
  },

  // Linear Style - Ultra minimal black
  'linear': {
    id: 'linear',
    name: 'Linear',
    description: 'Ultra-minimal design inspired by Linear',
    colors: {
      base: '#000000',
      layer1: '#0a0a0a',
      layer2: '#141414',
      layer3: '#1f1f1f',
      layer4: '#292929',
      surface: '#0d0d0d',
      surfaceHover: '#171717',
      surfaceActive: '#1f1f1f',
      border: 'rgba(255, 255, 255, 0.06)',
      borderSubtle: 'rgba(255, 255, 255, 0.03)',
      borderStrong: 'rgba(255, 255, 255, 0.12)',
      text: '#ffffff',
      textMuted: '#888888',
      textSubtle: '#666666',
      accent: '#5e6ad2',
      accentMuted: 'rgba(94, 106, 210, 0.15)',
      accentHover: '#7c85e0',
      success: '#3fb950',
      warning: '#d29922',
      error: '#f85149',
      info: '#58a6ff',
      gradient: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
    },
    fonts: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", monospace',
    },
    radius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.5)',
      md: '0 4px 16px rgba(0, 0, 0, 0.6)',
      lg: '0 12px 48px rgba(0, 0, 0, 0.7)',
      glow: '0 0 60px rgba(94, 106, 210, 0.1)',
    },
  },

  // Vercel/v0 Style - Charcoal with subtle borders
  'vercel': {
    id: 'vercel',
    name: 'Vercel',
    description: 'Modern charcoal theme inspired by Vercel & v0',
    colors: {
      base: '#0a0a0a',
      layer1: '#111111',
      layer2: '#171717',
      layer3: '#1f1f1f',
      layer4: '#262626',
      surface: '#141414',
      surfaceHover: '#1a1a1a',
      surfaceActive: '#202020',
      border: 'rgba(255, 255, 255, 0.1)',
      borderSubtle: 'rgba(255, 255, 255, 0.05)',
      borderStrong: 'rgba(255, 255, 255, 0.2)',
      text: '#ededed',
      textMuted: '#888888',
      textSubtle: '#666666',
      accent: '#0070f3',
      accentMuted: 'rgba(0, 112, 243, 0.15)',
      accentHover: '#0060df',
      success: '#50e3c2',
      warning: '#f5a623',
      error: '#e00',
      info: '#0070f3',
      gradient: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent)',
    },
    fonts: {
      sans: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Geist Mono", "SF Mono", monospace',
    },
    radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px' },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
      md: '0 4px 8px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
      glow: '0 0 80px rgba(0, 112, 243, 0.15)',
    },
  },

  // shadcn/ui Style - HSL-based with zinc
  'shadcn': {
    id: 'shadcn',
    name: 'shadcn/ui',
    description: 'Component-driven theme based on shadcn/ui',
    colors: {
      base: 'hsl(240, 10%, 3.9%)',
      layer1: 'hsl(240, 6%, 6%)',
      layer2: 'hsl(240, 5%, 10%)',
      layer3: 'hsl(240, 4%, 14%)',
      layer4: 'hsl(240, 4%, 18%)',
      surface: 'hsl(240, 5%, 8%)',
      surfaceHover: 'hsl(240, 4%, 12%)',
      surfaceActive: 'hsl(240, 4%, 15%)',
      border: 'hsl(240, 3.7%, 15.9%)',
      borderSubtle: 'hsl(240, 3.7%, 12%)',
      borderStrong: 'hsl(240, 3.7%, 22%)',
      text: 'hsl(0, 0%, 98%)',
      textMuted: 'hsl(240, 5%, 64.9%)',
      textSubtle: 'hsl(240, 5%, 45%)',
      accent: 'hsl(0, 0%, 98%)',
      accentMuted: 'hsl(240, 3.7%, 15.9%)',
      accentHover: 'hsl(0, 0%, 90%)',
      success: 'hsl(142, 76%, 36%)',
      warning: 'hsl(38, 92%, 50%)',
      error: 'hsl(0, 84%, 60%)',
      info: 'hsl(217, 91%, 60%)',
    },
    fonts: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Fira Code", "SF Mono", monospace',
    },
    radius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.35)',
      glow: 'none',
    },
  },

  // Notion Style - Warm dark
  'notion': {
    id: 'notion',
    name: 'Notion',
    description: 'Warm dark theme inspired by Notion',
    colors: {
      base: '#191919',
      layer1: '#1f1f1f',
      layer2: '#252525',
      layer3: '#2d2d2d',
      layer4: '#363636',
      surface: '#202020',
      surfaceHover: '#282828',
      surfaceActive: '#303030',
      border: 'rgba(255, 255, 255, 0.09)',
      borderSubtle: 'rgba(255, 255, 255, 0.05)',
      borderStrong: 'rgba(255, 255, 255, 0.14)',
      text: 'rgba(255, 255, 255, 0.9)',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      textSubtle: 'rgba(255, 255, 255, 0.4)',
      accent: '#2383e2',
      accentMuted: 'rgba(35, 131, 226, 0.15)',
      accentHover: '#4299e1',
      success: '#4daa57',
      warning: '#cb912f',
      error: '#e03e3e',
      info: '#2383e2',
    },
    fonts: {
      sans: '"ui-sans-serif", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"SFMono-Regular", "SF Mono", monospace',
    },
    radius: { sm: '3px', md: '5px', lg: '8px', xl: '12px' },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
      md: '0 3px 10px rgba(0, 0, 0, 0.25)',
      lg: '0 8px 30px rgba(0, 0, 0, 0.35)',
      glow: 'none',
    },
  },

  // GitHub Style - Based on Primer dark
  'github': {
    id: 'github',
    name: 'GitHub',
    description: 'Developer-focused theme inspired by GitHub',
    colors: {
      base: '#0d1117',
      layer1: '#161b22',
      layer2: '#21262d',
      layer3: '#30363d',
      layer4: '#484f58',
      surface: '#161b22',
      surfaceHover: '#1f242a',
      surfaceActive: '#262c34',
      border: '#30363d',
      borderSubtle: '#21262d',
      borderStrong: '#484f58',
      text: '#f0f6fc',
      textMuted: '#8b949e',
      textSubtle: '#6e7681',
      accent: '#58a6ff',
      accentMuted: 'rgba(88, 166, 255, 0.15)',
      accentHover: '#79b8ff',
      success: '#3fb950',
      warning: '#d29922',
      error: '#f85149',
      info: '#58a6ff',
    },
    fonts: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", sans-serif',
      mono: '"SFMono-Regular", "Consolas", "Liberation Mono", monospace',
    },
    radius: { sm: '3px', md: '6px', lg: '8px', xl: '12px' },
    shadows: {
      sm: '0 1px 0 rgba(27, 31, 35, 0.1)',
      md: '0 3px 6px rgba(0, 0, 0, 0.15)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.25)',
      glow: '0 0 30px rgba(88, 166, 255, 0.1)',
    },
  },

  // Obsidian Style - Deep purple/grey
  'obsidian': {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Deep purple-grey theme for focused work',
    colors: {
      base: '#1e1e2e',
      layer1: '#232334',
      layer2: '#2a2a3c',
      layer3: '#313145',
      layer4: '#3a3a4f',
      surface: '#262637',
      surfaceHover: '#2d2d40',
      surfaceActive: '#343449',
      border: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.04)',
      borderStrong: 'rgba(255, 255, 255, 0.12)',
      text: '#cdd6f4',
      textMuted: '#a6adc8',
      textSubtle: '#7f849c',
      accent: '#cba6f7',
      accentMuted: 'rgba(203, 166, 247, 0.15)',
      accentHover: '#dbb9ff',
      success: '#a6e3a1',
      warning: '#f9e2af',
      error: '#f38ba8',
      info: '#89b4fa',
      gradient: 'linear-gradient(135deg, #1e1e2e 0%, #181825 100%)',
    },
    fonts: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px' },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
      glow: '0 0 40px rgba(203, 166, 247, 0.1)',
    },
  },
};

export const defaultTheme = 'grey-silver';

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  // Set CSS custom properties on :root
  const cssVars: Record<string, string> = {
    '--color-base': theme.colors.base,
    '--color-layer1': theme.colors.layer1,
    '--color-layer2': theme.colors.layer2,
    '--color-layer3': theme.colors.layer3,
    '--color-layer4': theme.colors.layer4,
    '--color-surface': theme.colors.surface,
    '--color-surface-hover': theme.colors.surfaceHover,
    '--color-surface-active': theme.colors.surfaceActive,
    '--color-border': theme.colors.border,
    '--color-border-subtle': theme.colors.borderSubtle,
    '--color-border-strong': theme.colors.borderStrong,
    '--color-text': theme.colors.text,
    '--color-text-muted': theme.colors.textMuted,
    '--color-text-subtle': theme.colors.textSubtle,
    '--color-accent': theme.colors.accent,
    '--color-accent-muted': theme.colors.accentMuted,
    '--color-accent-hover': theme.colors.accentHover,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
    '--color-info': theme.colors.info,
    '--font-sans': theme.fonts.sans,
    '--font-mono': theme.fonts.mono,
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--radius-xl': theme.radius.xl,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
    '--shadow-glow': theme.shadows.glow,
  };
  
  if (theme.colors.gradient) {
    cssVars['--color-gradient'] = theme.colors.gradient;
  }
  if (theme.colors.glow) {
    cssVars['--color-glow'] = theme.colors.glow;
  }
  
  // Apply all CSS variables
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Also directly set body background for immediate visual change
  body.style.backgroundColor = theme.colors.base;
  body.style.color = theme.colors.text;
  
  // Store theme ID as data attribute for debugging
  root.setAttribute('data-theme', theme.id);
}

