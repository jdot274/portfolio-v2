'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { themes, defaultTheme, applyTheme } from '@/lib/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  // Apply theme on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme whenever it changes or on initial mount
  useEffect(() => {
    if (mounted) {
      const theme = themes[currentTheme] || themes[defaultTheme];
      console.log('ThemeProvider: Applying theme:', currentTheme, theme.colors.base);
      applyTheme(theme);
    }
  }, [currentTheme, mounted]);

  // Subscribe to store changes for immediate updates
  useEffect(() => {
    if (!mounted) return;
    
    const unsubscribe = useThemeStore.subscribe((state, prevState) => {
      if (state.currentTheme !== prevState.currentTheme) {
        const theme = themes[state.currentTheme] || themes[defaultTheme];
        console.log('ThemeProvider: Theme changed to:', state.currentTheme);
        applyTheme(theme);
      }
    });
    
    return () => unsubscribe();
  }, [mounted]);

  // Initial theme application after hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTheme = useThemeStore.getState().currentTheme;
      const theme = themes[savedTheme] || themes[defaultTheme];
      console.log('ThemeProvider: Initial delayed apply:', savedTheme);
      applyTheme(theme);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
