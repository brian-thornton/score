import styles from "./MatchResult.module.css";
import { Match } from "@/app/lib/types";

type MatchResultProps = {
  match: Match;
};

const MatchResult = ({ match }: MatchResultProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.result}>
        <h2>Match Winner</h2>
        <p>{match.winner?.player.name}</p>
      </div>
    </div>
  );
};

export default MatchResult;