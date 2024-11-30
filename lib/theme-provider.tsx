'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'rose';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'default',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  );
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(
    () => (localStorage.getItem(`${storageKey}-color`) as ColorScheme) || defaultColorScheme
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('theme-switching');

    // Remove old classes
    root.classList.remove('light', 'dark');
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-rose');

    // Add new theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Add color scheme
    if (colorScheme !== 'default') {
      root.classList.add(`theme-${colorScheme}`);
    }

    // Enable transitions after theme switch
    setTimeout(() => {
      root.classList.remove('theme-switching');
    }, 0);
  }, [theme, colorScheme]);

  const value = React.useMemo(
    () => ({
      theme,
      colorScheme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(`${storageKey}-mode`, newTheme);
        setTheme(newTheme);
      },
      setColorScheme: (newScheme: ColorScheme) => {
        localStorage.setItem(`${storageKey}-color`, newScheme);
        setColorScheme(newScheme);
      },
    }),
    [theme, colorScheme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Enhanced Theme Switcher Component
export function ThemeSwitcher() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  const [showColorSchemes, setShowColorSchemes] = React.useState(false);

  return (
    <div className="relative inline-block">
      <motion.div
        className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-sm"
        layout
      >
        <AnimatePresence mode="wait">
          {['light', 'dark', 'system'].map((t) => (
            <motion.button
              key={t}
              onClick={() => setTheme(t as Theme)}
              className={cn(
                "relative rounded-full p-2 transition-colors",
                theme === t
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t === 'light' && <Sun className="h-4 w-4" />}
              {t === 'dark' && <Moon className="h-4 w-4" />}
              {t === 'system' && <Monitor className="h-4 w-4" />}
            </motion.button>
          ))}
          <motion.button
            onClick={() => setShowColorSchemes(!showColorSchemes)}
            className={cn(
              "relative rounded-full p-2 transition-colors",
              showColorSchemes
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Palette className="h-4 w-4" />
          </motion.button>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showColorSchemes && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 rounded-lg border border-zinc-800 bg-zinc-900/90 p-2 backdrop-blur-sm"
          >
            {['default', 'blue', 'green', 'purple', 'rose'].map((scheme) => (
              <button
                key={scheme}
                onClick={() => setColorScheme(scheme as ColorScheme)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  colorScheme === scheme
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                )}
              >
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  scheme === 'default' && "bg-zinc-400",
                  scheme === 'blue' && "bg-blue-500",
                  scheme === 'green' && "bg-green-500",
                  scheme === 'purple' && "bg-purple-500",
                  scheme === 'rose' && "bg-rose-500"
                )} />
                <span className="capitalize">{scheme}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 