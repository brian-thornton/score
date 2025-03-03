import styles from './MatchTable.module.css';
import { MatchPlayer, Match } from '@/app/lib/types';

type MatchTableProps = {
  match: Match;
  displayStartRound?: number;
  displayEndRound?: number;
}

const MatchTable = ({ match, displayEndRound, displayStartRound }: MatchTableProps) => {
  const cellStyle = (player: MatchPlayer) => {
    if (match.winner && player.player.id === match.winner.player.id) {
      return styles.winnerCell;
    }

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

  const renderHeaderDisplayRange = () => {
    if (displayStartRound && displayEndRound) {
      return Array.from({ length: displayEndRound - displayStartRound + 1 }, (_, i) => i).map((_, index) => (
        <th className={match.currentRound === (index + displayStartRound) ? styles.activeRoundHeader : styles.th} key={index}>Round {index + displayStartRound}</th>
      ));
    }

    return Array.from({ length: match.maxRounds }, (_, i) => i).map((_, index) => (
      <th className={match.currentRound === (index + 1) ? styles.activeRoundHeader : styles.th} key={index}>Round {index + 1}</th>
    ));
  };

  const renderScoreCellsInDisplayRange = (player: MatchPlayer) => {
    if (displayStartRound && displayEndRound) {
      return player.roundScores.slice(displayStartRound - 1, displayEndRound).map((score, index) => (
        <td className={cellStyle(player)} key={index}>{score}</td>
      ));
    }

    return player.roundScores.map((score, index) => (
      <td className={cellStyle(player)} key={index}>{score}</td>
    ));
  }

  const fillEmptyCellsToDisplayEndRound = (player: MatchPlayer) => {
    if (displayStartRound && displayEndRound) {
      const emptyCells = Array.from({ length: displayEndRound - player.roundScores.length }, (_, i) => i);

      return emptyCells.map((_, index) => (
        <td className={cellStyle(player)} key={index}></td>
      ));
    }

    return null;
  };

  const fillEmptyCellsInDisplayRange = (player: MatchPlayer) => {
    if (displayStartRound && displayEndRound) {
      const emptyCells = Array.from({ length: displayEndRound - displayStartRound - player.roundScores.length }, (_, i) => i);

      console.log(emptyCells);
      return emptyCells.map((_, index) => (
        <td className={cellStyle(player)} key={index}></td>
      ));
    }

    return null;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Player</th>
            {renderHeaderDisplayRange()}
            <th className={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {match.matchPlayers.map((player) => (
            <tr className={cellStyle(player)} key={player.player.id}>
              <td className={styles.td}>{player.player.name}</td>
              {renderScoreCellsInDisplayRange(player)}
              {!displayStartRound && fillEmptyCells(player)}
              {displayStartRound && fillEmptyCellsToDisplayEndRound(player)}
              <td className={styles.td}>{player.roundScores.reduce((a, b) => a + b, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;