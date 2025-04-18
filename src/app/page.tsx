import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <img src="logo.png" alt="Logo" className={styles.image} />
    </div>
  );
}
