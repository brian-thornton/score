import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (

    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <a href="/" className={styles.logo}>
          Score
        </a>
      </div>
      <div className={styles.navbarRight}>
        <a href="/players" className={styles.navbarLink}>
          Players
        </a>
        <a href="/games/tournament" className={styles.navbarLink}>
          Tournament
        </a>
        <a href="/games/target-number" className={styles.navbarLink}>
          Target Number
        </a>
      </div>
    </nav>
  );
};

export default Navbar;