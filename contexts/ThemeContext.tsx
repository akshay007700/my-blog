import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Theme } from '@/types/news';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: Theme = {
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#007AFF',
  border: '#E5E5E5',
  tabBar: '#FFFFFF',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
};

const darkTheme: Theme = {
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#98989F',
  primary: '#0A84FF',
  border: '#38383A',
  tabBar: '#1C1C1E',
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const updateThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    AsyncStorage.setItem('themeMode', mode);
  };

  const effectiveTheme = themeMode === 'auto' 
    ? (systemColorScheme === 'dark' ? darkTheme : lightTheme)
    : (themeMode === 'dark' ? darkTheme : lightTheme);

  const isDarkMode = themeMode === 'auto' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{
      theme: effectiveTheme,
      themeMode,
      setThemeMode: updateThemeMode,
      isDark: isDarkMode,
      isLoading,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};