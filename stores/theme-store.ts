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
          console.log('Store: setTheme called with:', themeId);
          // Apply theme immediately
          if (typeof window !== 'undefined') {
            applyTheme(theme);
          }
          // Then update state
          set({ currentTheme: themeId });
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
        // Apply theme on rehydration (page load)
        if (state && typeof window !== 'undefined') {
          console.log('Store: Rehydrating with theme:', state.currentTheme);
          const theme = themes[state.currentTheme] || themes[defaultTheme];
          // Delay slightly to ensure DOM is ready
          setTimeout(() => {
            applyTheme(theme);
          }, 0);
        }
      },
    }
  )
);
