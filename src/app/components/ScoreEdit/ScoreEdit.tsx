"use client";
import { useState } from 'react';
import styles from './ScoreEdit.module.css';

type ScoreEditProps = {
  onSave: (score: number) => void;
  onCancel: () => void;
  currentScore: number;
  round: string;
  playerName: string;
  possibleScores: string[];
};

const ScoreEdit = ({
  onSave,
  onCancel,
  currentScore,
  round,
  playerName,
  possibleScores,
}: ScoreEditProps) => {
  const [score, setScore] = useState(currentScore);

  const handleSave = () => {
    onSave(score);
    onCancel();
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Edit Score for {playerName} in {round}</h3>
      <div className={styles.buttonRow}>
        {possibleScores.map((possibleScore) => (
          <div key={possibleScore} className={styles.scoreOption}>
            <button
              className={styles.scoreButton}
              onClick={() => setScore(Number(possibleScore))}
            >{possibleScore}</button>
          </div>
        ))}
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.controlButton} onClick={handleSave}>Save</button>
        <button className={styles.controlButton} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ScoreEdit;