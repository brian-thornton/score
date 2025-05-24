import style from './GameControls.module.css';

interface GameControlsProps {
  onStartGame?: () => void;
  onEndGame?: () => void;
  isGameActive?: boolean;
  isGameComplete?: boolean;
  canStartGame?: boolean;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStartGame,
  onEndGame,
  isGameActive = false,
  isGameComplete = false,
  canStartGame = true,
  className,
}) => {
  return (
    <div className={`${style.container} ${className || ''}`}>
      {!isGameActive && (
        <button 
          className={style.controlButton}
          onClick={onStartGame}
          disabled={!canStartGame}
        >
          Start Game
        </button>
      )}
      {isGameActive && !isGameComplete && (
        <button 
          className={style.controlButton}
          onClick={onEndGame}
        >
          End Game
        </button>
      )}
      {isGameComplete && (
        <div className={style.controlsRow}>
          <button 
            className={style.controlButton}
            onClick={onEndGame}
          >
            End Game
          </button>
          <button 
            className={style.controlButton}
            onClick={onStartGame}
            disabled={!canStartGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls;