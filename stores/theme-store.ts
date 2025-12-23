import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes, defaultTheme, applyTheme, Theme } from '@/lib/themes';

interface ThemeState {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  getTheme: () => Theme;
  getAllThemes: () => Theme[];
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      
      setTheme: (themeId: string) => {
        const theme = themes[themeId];
        if (theme) {
          set({ currentTheme: themeId });
          if (typeof window !== 'undefined') {
            applyTheme(theme);
          }
        }
      },
      
      getTheme: () => {
        return themes[get().currentTheme] || themes[defaultTheme];
      },
      
      getAllThemes: () => {
        return Object.values(themes);
      },
    }),
    {
      name: 'portfolio-v2-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load
        if (state && typeof window !== 'undefined') {
          const theme = themes[state.currentTheme] || themes[defaultTheme];
          applyTheme(theme);
        }
      },
    }
  )
);

