import styles from './MatchTable.module.css';
import { MatchPlayer, Match } from '@/app/lib/types';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

type MatchTableProps = {
  match: Match;
  displayStartRound?: number;
  displayEndRound?: number;
  onScoreClick?: (player: MatchPlayer, round: number) => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const MatchTable = ({ match, displayEndRound, displayStartRound, onScoreClick }: MatchTableProps) => {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setViewportSize('mobile');
      } else if (width <= 1024) {
        setViewportSize('tablet');
      } else {
        setViewportSize('desktop');
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const cellStyle = (player: MatchPlayer) => {
    if (match.winner && player.player.id === match.winner.player.id) {
      return styles.winnerCell;
    }

    if (player.player.id === match.currentPlayer?.id) {
      return styles.currentPlayerCell;
    }

    return styles.scoreCell;
  }

  const getVisibleRounds = () => {
    if (viewportSize === 'desktop') {
      return {
        start: displayStartRound || 1,
        end: displayEndRound || match.maxRounds
      };
    }

    const currentRound = match.currentRound;
    const range = viewportSize === 'mobile' ? 1 : 2; // 1 for mobile (3 columns), 2 for tablet (5 columns)

    return {
      start: Math.max(1, currentRound - range),
      end: Math.min(match.maxRounds, currentRound + range)
    };
  };

  const renderHeaderDisplayRange = () => {
    const { start, end } = getVisibleRounds();
    const rounds = Array.from({ length: end - start + 1 }, (_, i) => i + start);

    return rounds.map((round) => (
      <th 
        className={match.currentRound === round ? styles.activeRoundHeader : styles.th}
        key={v4()}
      >
        Round {round}
      </th>
    ));
  };

  const renderScoreCellsInDisplayRange = (player: MatchPlayer) => {
    const { start, end } = getVisibleRounds();
    const rounds = Array.from({ length: end - start + 1 }, (_, i) => i + start);

    return rounds.map((round) => {
      const score = player.roundScores[round - 1];
      return (
        <td
          className={cellStyle(player)}
          key={v4()}
          onClick={() => onScoreClick ? onScoreClick(player, round) : () => {}}>
          {score}
        </td>
      );
    });
  };

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
            <tr className={cellStyle(player)} key={v4()}>
              <td className={styles.td} key={v4()}>{player.player.name}</td>
              {renderScoreCellsInDisplayRange(player)}
              <td className={styles.td} key={v4()}>{player.roundScores.reduce((a, b) => Number(a) + Number(b), 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;