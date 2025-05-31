"use client";

import React from 'react';

const themes = [
  { id: 'deepblue', name: 'Deep Blue', colors: { primary: '#0c283d', secondary: '#2986cc', text: '#f5f5f5', hover: '#2986cc' } },
  { id: 'forest', name: 'Forest', colors: { primary: '#1b4332', secondary: '#40916c', text: '#f5f5f5', hover: '#52b788' } },
  { id: 'matrix', name: 'Matrix', colors: { primary: '#000000', secondary: '#003300', text: '#00ff00', hover: '#006600' } },
];

export const ThemeContext = React.createContext({
  theme: 'deepblue',
  setTheme: (theme: string) => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState('deepblue');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'deepblue';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      root.style.setProperty('--primary-color', theme.colors.primary);
      root.style.setProperty('--secondary-color', theme.colors.secondary);
      root.style.setProperty('--text-color', theme.colors.text);
      root.style.setProperty('--hover', theme.colors.hover);
      root.setAttribute('data-theme', themeId);
      localStorage.setItem('theme', themeId);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
} 