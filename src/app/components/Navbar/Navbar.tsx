"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { ThemeContext } from '@/app/components/ThemeProvider';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/player-admin/players', label: 'Players' },
  { href: '/player-admin/teams', label: 'Teams' },
  { href: '/games/tournament', label: 'Tournament' },
  { href: '/games/target-number', label: 'Target Number' },
  { href: '/games/target-goal', label: 'Targets' },
  { href: '/match-history', label: 'Match History' },
  { href: '/settings', label: 'Settings' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, setTheme } = React.useContext(ThemeContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const themes = ['deepblue', 'forest', 'matrix', 'purple'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    console.log('Switching to theme:', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.logo}>
          Score
        </Link>
      </div>
      <div className={`${styles.navbarRight} ${isMenuOpen ? styles.menuOpen : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navbarLink} ${
              pathname === link.href ? styles.active : ''
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button 
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={`Current theme: ${theme}`}
        >
          {theme === 'deepblue' ? '🌊' : 
           theme === 'forest' ? '🌲' : 
           theme === 'matrix' ? '💻' :
           theme === 'purple' ? '💜' : '🌊'}
        </button>
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;