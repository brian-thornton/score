"use client";

import React from 'react';

const themes = [
  { id: 'deepblue', name: 'Deep Blue', colors: { primary: '#0c283d', secondary: '#2986cc', accent: '#1a4b6e', text: '#f5f5f5', hover: '#2986cc' } },
  { id: 'forest', name: 'Forest', colors: { primary: '#1b4332', secondary: '#40916c', accent: '#2d6a4f', text: '#f5f5f5', hover: '#52b788' } },
  { id: 'matrix', name: 'Matrix', colors: { primary: '#000000', secondary: '#003300', accent: '#001a00', text: '#00ff00', hover: '#006600' } },
  { id: 'purple', name: 'Purple', colors: { primary: '#2d1b69', secondary: '#6b4caf', accent: '#4a3b8c', text: '#f5f5f5', hover: '#8a6dff' } },
  { id: 'orange', name: 'Orange', colors: { primary: '#ff6b00', secondary: '#ff8533', accent: '#ff9966', text: '#ffffff', hover: '#ffad80' } },
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
    console.log('Loading saved theme:', savedTheme);
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    console.log('Applying theme:', themeId);
    const root = document.documentElement;
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      console.log('Found theme:', theme);
      root.style.setProperty('--primary-color', theme.colors.primary);
      root.style.setProperty('--secondary-color', theme.colors.secondary);
      root.style.setProperty('--accent-color', theme.colors.accent);
      root.style.setProperty('--text-color', theme.colors.text);
      root.style.setProperty('--hover', theme.colors.hover);
      root.setAttribute('data-theme', themeId);
      localStorage.setItem('theme', themeId);
    } else {
      console.log('Theme not found:', themeId);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    console.log('Theme change requested:', newTheme);
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