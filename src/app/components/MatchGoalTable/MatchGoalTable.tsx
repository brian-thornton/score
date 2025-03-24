import styles from './MatchGoalTable.module.css';
import { MatchPlayer, Match } from '@/app/lib/types';

type MatchTableProps = {
  match: Match;
}

const MatchGoalTable = ({ match }: MatchTableProps) => {
  const headers = ['Upper Left', 'Upper Right', 'Center Bottom', 'Lower Right', 'Center Top', 'Lower Left'];
  console.log(match)
  const cellStyle = (player: MatchPlayer) => {
    console.log(player)
    if (match.winner && player.player.id === match.winner.player.id) {
      return styles.winnerCell;
    }

    if (player.player.id === match.currentPlayer?.id) {
      return styles.currentPlayerCell;
    }

    return styles.scoreCell;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Player</th>
            {headers.map((header, index) => (
              <th className={styles.th} key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {match.matchPlayers.map((player) => (
            <tr className={cellStyle(player)} key={player.player.id}>
              <td className={styles.td}>{player.player.name}</td>
              {headers.map((h, index) => (
                <td className={cellStyle(player)} key={index}>
                  {player.roundScores.includes(h) ? 'X' : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchGoalTable;