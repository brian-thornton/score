import style from './GameControls.module.css';

const GameControls = () => {
  return (
    <div className={style.container}>
      <button className={style.controlButton}>Start Game</button>
      <button className={style.controlButton}>End Game</button>
    </div>
  );
};

export default GameControls;