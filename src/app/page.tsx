import styles from "./page.module.css";
import Navbar from "./components/Navbar/Navbar";
import MatchGoalTable from "./components/MatchGoalTable/MatchGoalTable";

export default function Home() {
  return (
    <div className={styles.page}>
      <img src="logo.png" alt="Logo" className={styles.image} />
    </div>
  );
}
