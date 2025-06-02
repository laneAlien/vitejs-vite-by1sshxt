// src/shared/ui/ThemeToggle/ThemeContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useMotionValue, animate } from 'framer-motion';

type Theme = 'day' | 'night' | 'system';
type ActualTheme = Exclude<Theme, 'system'>;

interface ThemeContextType {
  theme: Theme;
  actualTheme: ActualTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeVariables = {
  day: {
    '--tg-theme-bg-color': '#ffffff',
    '--tg-theme-text-color': '#000000',
    '--tg-theme-hint-color': '#707579',
    '--tg-theme-link-color': '#168acd',
    '--tg-theme-button-color': '#50a8eb',
    '--tg-theme-button-text-color': '#ffffff',
    '--tg-theme-secondary-bg-color': '#f0f2f5',
  },
  night: {
    '--tg-theme-bg-color': '#0f0f0f',
    '--tg-theme-text-color': '#ffffff',
    '--tg-theme-hint-color': '#aaaaaa',
    '--tg-theme-link-color': '#6ab3f3',
    '--tg-theme-button-color': '#3894eb',
    '--tg-theme-button-text-color': '#ffffff',
    '--tg-theme-secondary-bg-color': '#1a1a1a',
  },
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  storageKey?: string;
  themes?: Theme[];
}

export function ThemeProvider({
  children,
  initialTheme = 'system',
  storageKey = 'library-theme',
  themes = ['day', 'night', 'system'],
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return initialTheme;
    const saved = localStorage.getItem(storageKey);
    return themes.includes(saved as Theme) ? saved as Theme : initialTheme;
  });

  const systemTheme = useMatchMedia('(prefers-color-scheme: dark)') ? 'night' : 'day';
  const actualTheme: ActualTheme = theme === 'system' ? systemTheme : theme;

  // Анимация перехода между темами
  const overlayOpacity = useMotionValue(0);
  
  const applyTheme = (newTheme: ActualTheme) => {
    const variables = ThemeVariables[newTheme];
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'night' : 'day');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = async () => {
      await animate(overlayOpacity, 1, { duration: 0.15 });
      applyTheme(actualTheme);
      await animate(overlayOpacity, 0, { duration: 0.3 });
    };

    handleThemeChange();
  }, [actualTheme]);

  const value = useMemo(() => ({
    theme,
    actualTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    toggleTheme: () => {
      const newTheme = theme === 'day' ? 'night' : 'day';
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  }), [theme, actualTheme, storageKey]);

  return (
    <ThemeContext.Provider value={value}>
      {/* Overlay для плавной смены темы */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--tg-theme-bg-color)',
        opacity: overlayOpacity,
        pointerEvents: 'none',
        zIndex: 9999
      }} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Хелпер для SSR
const useMatchMedia = (query: string) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
