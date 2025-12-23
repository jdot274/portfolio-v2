'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { themes, defaultTheme, applyTheme } from '@/lib/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    // Apply theme immediately on mount
    const theme = themes[currentTheme] || themes[defaultTheme];
    applyTheme(theme);
  }, []);

  useEffect(() => {
    if (mounted) {
      const theme = themes[currentTheme] || themes[defaultTheme];
      applyTheme(theme);
    }
  }, [currentTheme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  // The children still render but without theme-specific inline styles
  return <>{children}</>;
}

