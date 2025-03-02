import styles from './MatchTable.module.css';
import { MatchPlayer, Match } from '@/app/lib/types';

type MatchTableProps = {
  match: Match;
}

const MatchTable = ({ match }: MatchTableProps) => {
  const cellStyle = (player: MatchPlayer) => {
    if (player.player.id === match.currentPlayer?.id) {
      return styles.currentPlayerCell;
    }

    return styles.scoreCell;
  }

  const fillEmptyCells = (player: MatchPlayer) => {
    const emptyCells = Array.from({ length: match.maxRounds - player.roundScores.length }, (_, i) => i);

    return emptyCells.map((_, index) => (
      <td className={cellStyle(player)} key={index}></td>
    ));
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Player</th>
            {Array.from({ length: match.maxRounds }, (_, i) => i).map((_, index) => (
              <th className={match.currentRound === (index + 1)? styles.activeRoundHeader : styles.th} key={index}>Round {index + 1}</th>
            ))}
            <th className={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {match.matchPlayers.map((player) => (
            <tr className={player.player.id === match.currentPlayer?.id ? styles.currentPlayer : styles.tr} key={player.player.id}>
              <td className={styles.td}>{player.player.name}</td>
              {player.roundScores.map((score, index) => (
                <td className={cellStyle(player)}  key={index}>{score}</td>
              ))}
              {fillEmptyCells(player)}
              <td className={styles.td}>{player.roundScores.reduce((a, b) => a + b, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;