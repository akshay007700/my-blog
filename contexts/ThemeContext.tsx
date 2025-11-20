import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '@/constants/themes';
import { Theme } from '@/types/news';

type ThemeMode = 'light' | 'dark' | 'auto';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((stored) => {
      if (stored) {
        setThemeMode(stored as ThemeMode);
      }
      setIsLoading(false);
    });
  }, []);

  const updateThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    AsyncStorage.setItem('themeMode', mode);
  }, []);

  const effectiveTheme = useMemo((): Theme => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const isDarkMode = useMemo(() => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  return useMemo(() => ({
    theme: effectiveTheme,
    themeMode,
    setThemeMode: updateThemeMode,
    isDark: isDarkMode,
    isLoading,
  }), [effectiveTheme, themeMode, updateThemeMode, isDarkMode, isLoading]);
});
