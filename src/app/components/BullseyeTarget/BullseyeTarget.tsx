"use client";
import { useState } from 'react';
import styles from './BullseyeTarget.module.css';

type BullseyeTargetProps = {
  onScore?: (score: number) => void;
  size?: number;
};

const BullseyeTarget = ({ onScore, size = 300 }: BullseyeTargetProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const handleClick = (score: number) => {
    setSelectedScore(score);
    onScore?.(score);
  };

  // WATL scoring rings from outer to inner
  const rings = [
    { score: 1, color: '#000000' },  // Outer ring
    { score: 2, color: '#FF0000' },  // Red ring
    { score: 3, color: '#000000' },  // Black ring
    { score: 4, color: '#FF0000' },  // Red ring
    { score: 5, color: '#000000' },  // Black ring
    { score: 6, color: '#FF0000' },  // Red ring
    { score: 7, color: '#000000' },  // Black ring
    { score: 8, color: '#FF0000' },  // Red ring
    { score: 9, color: '#000000' },  // Black ring
    { score: 10, color: '#FF0000' }, // Bullseye
  ];

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <div className={styles.target}>
        {rings.map((ring, index) => (
          <button
            key={ring.score}
            className={styles.ring}
            style={{
              width: `${((rings.length - index) / rings.length) * 100}%`,
              height: `${((rings.length - index) / rings.length) * 100}%`,
              backgroundColor: ring.color,
              border: '2px solid #FFFFFF',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => handleClick(ring.score)}
          />
        ))}
      </div>
      {selectedScore !== null && (
        <div className={styles.scoreDisplay}>
          Score: {selectedScore}
        </div>
      )}
    </div>
  );
};

export default BullseyeTarget; 