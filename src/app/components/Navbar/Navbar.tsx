"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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