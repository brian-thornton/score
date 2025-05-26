"use client";
import React from 'react';
import styles from './settings.module.css';

const themes = [
  { id: 'light', name: 'Light', colors: { primary: '#fafafa', secondary: '#f0f0f0', text: '#000000' } },
  { id: 'deepblue', name: 'Deep Blue', colors: { primary: '#0c283d', secondary: '#2986cc', text: '#f5f5f5' } },
  { id: 'forest', name: 'Forest', colors: { primary: '#1b4332', secondary: '#40916c', text: '#f5f5f5' } },
  { id: 'matrix', name: 'Matrix', colors: { primary: '#000000', secondary: '#003300', text: '#00ff00' } },
];

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Initialize theme on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If no saved theme, use system preference
    if (!savedTheme) {
      const initialTheme = prefersDark ? 'dark' : 'light';
      setSelectedTheme(initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  // Apply theme changes
  React.useEffect(() => {
    const root = document.documentElement;
    const theme = themes.find(t => t.id === selectedTheme);
    if (theme) {
      root.style.setProperty('--primary-color', theme.colors.primary);
      root.style.setProperty('--secondary-color', theme.colors.secondary);
      root.style.setProperty('--text-color', theme.colors.text);
      localStorage.setItem('theme', selectedTheme);
    }
  }, [selectedTheme]);

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <div className={styles.section}>
        <h2>Theme</h2>
        <div className={styles.themeGrid}>
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`${styles.themeButton} ${selectedTheme === theme.id ? styles.selected : ''}`}
              onClick={() => setSelectedTheme(theme.id)}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.text,
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 