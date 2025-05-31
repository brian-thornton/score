import AxeLogo from './components/AxeLogo/AxeLogo';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <AxeLogo />
      <div className={styles.description}>
        Welcome to Axe Score - Your Ultimate Axe Throwing Companion
      </div>
    </main>
  );
}
