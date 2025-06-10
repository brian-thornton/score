import styles from "./ScoreInput.module.css";
import { Match } from "@/app/lib/types";

type ScoreInputProps = {
  possibleScores: number[] | string[];
  onChange: (match: Match, score: number | string, possibleScores: string[] | undefined) => void;
  match: Match;
  hideBullseye?: boolean;
};

const BullseyeTarget = ({ match, onChange }: { match: Match; onChange: ScoreInputProps['onChange'] }) => {
  const handleClick = (score: number) => {
    onChange(match, score, undefined);
  };

  return (
    <div className={styles.bullseyeContainer}>
      <div className={styles.bullseye}>
        <div 
          className={styles.killshotLeft} 
          onClick={() => handleClick(8)}
          title="Killshot: 8"
        ></div>
        <div 
          className={styles.killshotRight} 
          onClick={() => handleClick(8)}
          title="Killshot: 8"
        ></div>
        <div 
          className={styles.ring} 
          onClick={() => handleClick(1)}
          title="Score: 1"
        ></div>
        <div 
          className={styles.ring} 
          onClick={() => handleClick(2)}
          title="Score: 2"
        ></div>
        <div 
          className={styles.ring} 
          onClick={() => handleClick(3)}
          title="Score: 3"
        ></div>
        <div 
          className={styles.ring} 
          onClick={() => handleClick(4)}
          title="Score: 4"
        ></div>
        <div 
          className={styles.center} 
          onClick={() => handleClick(6)}
          title="Score: 6"
        ></div>
      </div>
    </div>
  );
};

const ScoreInput = ({ match, possibleScores, onChange, hideBullseye }: ScoreInputProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        {possibleScores.map((score) => (
          <button
            className={styles.scoreButton}
            key={score}
            onClick={() => onChange(match, score, Array.isArray(possibleScores) ? possibleScores.map(String) : undefined)}
          >
            {score}
          </button>
        ))}
      </div>
      {!hideBullseye && <BullseyeTarget match={match} onChange={onChange} />}
    </div>
  );
};

export default ScoreInput;

