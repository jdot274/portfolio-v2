'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { themes, defaultTheme, applyTheme } from '@/lib/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useThemeStore((state) => state.currentTheme);

  // Apply theme whenever it changes
  useEffect(() => {
    const theme = themes[currentTheme] || themes[defaultTheme];
    console.log('Applying theme:', currentTheme, theme.colors.base);
    applyTheme(theme);
  }, [currentTheme]);

  // Also apply on initial mount with a slight delay to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTheme = useThemeStore.getState().currentTheme;
      const theme = themes[savedTheme] || themes[defaultTheme];
      console.log('Initial theme apply:', savedTheme, theme.colors.base);
      applyTheme(theme);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
