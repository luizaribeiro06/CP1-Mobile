import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { getTheme as getAppTheme, type ThemeColors } from '../theme/theme';
import { getTheme as getStoredTheme, saveTheme as saveStoredTheme } from '../services/storageService';
import type { ThemeMode } from '../types/theme';

export type AppTheme = ReturnType<typeof getAppTheme>;
export type AppFonts = AppTheme['fonts'];

export type ThemeContextType = {
  isDark: boolean;
  themeMode: ThemeMode;
  theme: AppTheme;
  colors: ThemeColors;
  fonts: AppFonts;
  toggleTheme: () => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemScheme === 'dark');

  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await getStoredTheme();
        if (saved) {
          setIsDark(saved === 'dark');
        }
      } catch {
        // Usa tema do sistema em caso de falha de leitura
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    try {
      await saveStoredTheme(nextIsDark ? 'dark' : 'light');
    } catch {
      // Falha silenciosa de persistência
    }
  }, [isDark]);

  const theme = useMemo(() => getAppTheme(isDark), [isDark]);

  const value = useMemo<ThemeContextType>(
    () => ({
      isDark,
      themeMode: isDark ? 'dark' : 'light',
      theme,
      colors: theme.colors,
      fonts: theme.fonts,
      toggleTheme,
    }),
    [isDark, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
