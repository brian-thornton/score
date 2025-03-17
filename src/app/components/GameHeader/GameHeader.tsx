import style from './GameHeader.module.css';

type GameHeaderProps = {
  title: string;
};

const GameHeader = ({ title }: GameHeaderProps) => {
  return (
    <div className={style.header}>
      <h1>{title}</h1>
    </div>
  );
};

export default GameHeader;