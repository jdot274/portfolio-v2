'use client';

import { useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { themes } from '@/lib/themes';

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme, getAllThemes } = useThemeStore();
  const allThemes = getAllThemes();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                   bg-[var(--color-surface)] border border-[var(--color-border)]
                   hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]
                   transition-all duration-200"
      >
        <div 
          className="w-4 h-4 rounded-full border border-[var(--color-border)]"
          style={{ background: themes[currentTheme]?.colors.accent }}
        />
        <span className="text-sm text-[var(--color-text)]">
          {themes[currentTheme]?.name || 'Theme'}
        </span>
        <svg 
          className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown - opens upward since button is at bottom */}
          <div className="absolute left-0 bottom-full mb-2 w-72 z-50
                          bg-[var(--color-layer1)] border border-[var(--color-border)]
                          rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-[var(--color-text)]">Choose Theme</h3>
              <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                Professional design systems
              </p>
            </div>
            
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {allThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg
                             transition-all duration-200
                             ${currentTheme === theme.id 
                               ? 'bg-[var(--color-accent-muted)] border border-[var(--color-accent)]' 
                               : 'hover:bg-[var(--color-surface-hover)] border border-transparent'
                             }`}
                >
                  {/* Color preview */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-[var(--color-border)]">
                    <div 
                      className="w-full h-1/2" 
                      style={{ background: theme.colors.base }}
                    />
                    <div className="w-full h-1/2 flex">
                      <div 
                        className="w-1/3 h-full" 
                        style={{ background: theme.colors.layer2 }}
                      />
                      <div 
                        className="w-1/3 h-full" 
                        style={{ background: theme.colors.accent }}
                      />
                      <div 
                        className="w-1/3 h-full" 
                        style={{ background: theme.colors.layer3 }}
                      />
                    </div>
                  </div>
                  
                  {/* Theme info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {theme.name}
                      </span>
                      {currentTheme === theme.id && (
                        <svg className="w-4 h-4 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 line-clamp-1">
                      {theme.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="text-xs text-[var(--color-text-subtle)]">
                Based on research from ChatGPT, Linear, Vercel, shadcn/ui & more
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

