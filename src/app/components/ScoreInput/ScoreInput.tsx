import styles from "./ScoreInput.module.css";
import { Match } from "@/app/lib/types";

type ScoreInputProps = {
  possibleScores: number[] | string[];
  onChange: (match: Match, score: number | string, possibleScores: string[] | undefined) => void;
  match: Match;
};

const ScoreInput = ({ match, possibleScores, onChange }: ScoreInputProps) => {
  return (
    <div className={styles.container}>
      {possibleScores.map((score) => (
        <button className={styles.scoreButton} key={score} onClick={() => onChange(match, score, possibleScores)}>
          {score}
        </button>
      ))}
    </div>
  );
};

export default ScoreInput;

