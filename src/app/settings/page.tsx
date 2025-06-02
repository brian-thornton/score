"use client";
import React from 'react';
import styles from './settings.module.css';
import { ThemeContext } from '../components/ThemeProvider';
import { exportMatchHistoryToPDF } from '@/app/lib/pdf-export';

const themes = [
  { id: 'deepblue', name: 'Deep Blue', colors: { primary: '#0c283d', secondary: '#2986cc', text: '#f5f5f5', hover: '#2986cc' } },
  { id: 'forest', name: 'Forest', colors: { primary: '#1b4332', secondary: '#40916c', text: '#f5f5f5', hover: '#52b788' } },
  { id: 'matrix', name: 'Matrix', colors: { primary: '#000000', secondary: '#003300', text: '#00ff00', hover: '#006600' } },
  { id: 'purple', name: 'Purple', colors: { primary: '#2d1b69', secondary: '#6b4caf', text: '#f5f5f5', hover: '#8a6dff' } },
];

export default function SettingsPage() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportMatchHistoryToPDF();
    } catch (error) {
      console.error('Error exporting match history:', error);
      alert('Failed to export match history. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      <div className={styles.section}>
        <h2>Theme</h2>
        <div className={styles.themeGrid}>
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              className={`${styles.themeButton} ${theme === themeOption.id ? styles.selected : ''}`}
              onClick={() => setTheme(themeOption.id)}
              style={{
                backgroundColor: themeOption.colors.primary,
                color: themeOption.colors.text,
              }}
            >
              {themeOption.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h2>Match History</h2>
        <button 
          className={styles.exportButton}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export Match History to PDF'}
        </button>
      </div>
    </div>
  );
} 