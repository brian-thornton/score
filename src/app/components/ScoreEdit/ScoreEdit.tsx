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

type ScoreButtonProps = {
  score: string;
  isSelected: boolean;
  onClick: () => void;
};

const ScoreButton = ({ score, isSelected, onClick }: ScoreButtonProps) => (
  <div className={styles.scoreOption}>
    <button
      className={`${styles.scoreButton} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {score}
    </button>
  </div>
);

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
    <div className={styles.container} role="dialog" aria-labelledby="score-edit-title">
      <h3 id="score-edit-title" className={styles.header}>
        Edit Score for {playerName} in {round}
      </h3>
      <div className={styles.buttonRow} role="group" aria-label="Score options">
        {possibleScores.map((possibleScore) => (
          <ScoreButton
            key={possibleScore}
            score={possibleScore}
            isSelected={Number(possibleScore) === score}
            onClick={() => setScore(Number(possibleScore))}
          />
        ))}
      </div>
      <div className={styles.buttonRow}>
        <button 
          className={styles.controlButton} 
          onClick={handleSave}
          aria-label="Save score"
        >
          Save
        </button>
        <button 
          className={styles.controlButton} 
          onClick={onCancel}
          aria-label="Cancel editing"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ScoreEdit;