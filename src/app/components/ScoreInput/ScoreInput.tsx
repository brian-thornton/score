import styles from "./ScoreInput.module.css";
import { Match, Player } from "@/app/lib/types";

type ScoreInputProps = {
  possibleScores: number[];
  onChange: (match: Match, score: number) => void;
  match: Match;

};

const ScoreInput = ({ match, possibleScores, onChange }: ScoreInputProps) => {
  return (
    <div className={styles.container}>
      {possibleScores.map((score) => (
        <button className={styles.scoreButton} key={score} onClick={() => onChange(match, score)}>
          {score}
        </button>
      ))}
    </div>
  );
};

export default ScoreInput;

