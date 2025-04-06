"use client"
import { useEffect, useState } from "react";
import { getMatchHistory } from "../lib/match-history-helper";
import MatchTable from "../components/MatchTable/MatchTable";
import styles from "./page.module.css";
import Match from "../lib/types";
import { clearMatchHistory } from "../lib/match-history-helper";
import Confirm from "../components/Confirm/Confirm";
import MatchGoalTable from "../components/MatchGoalTable/MatchGoalTable";

const MatchHistoryPage = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const loadMatchHistory = async () => {
    const data = await getMatchHistory();
    setMatchHistory(data);
  };

  useEffect(() => {
    loadMatchHistory();
  }, []);

  const getMatchMaxRounds = (match: Match) => {
    let maxRounds = 0;
    match.matchPlayers.map(player => {
      if (player.roundScores.length > maxRounds) {
        maxRounds = player.roundScores.length;
      }
    });

    return maxRounds;
  };

  const getFirstRound = (maxRounds) => {
    if (maxRounds - 10 < 0) {
      return 1;
    }

    return maxRounds - 9;
  }

  return matchHistory && matchHistory?.matchHistory?.length > 0 ? (
    <div key="matches" className={styles.container}>
      {matchHistory.matchHistory.map((match) => (
        <div key={match.id} className={styles.matchContainer}>
          {!confirmDeleteOpen && (
            <>
              {match.matchType === 'GOAL_MATCH' && (
                <MatchGoalTable match={match} headers={match.possibleScores} />
              )}
              {match.matchType !== 'GOAL_MATCH' && (
                <MatchTable
                  match={match}
                  displayStartRound={match.matchType === 'TARGET_NUMBER' ? getFirstRound(getMatchMaxRounds(match)) : undefined}
                  displayEndRound={match.matchType === 'TARGET_NUMBER' ? getMatchMaxRounds(match) : undefined}
                />
              )}
            </>
          )}
        </div>
      ))}
      {!confirmDeleteOpen && (
        <button
          className={styles.controlButton}
          onClick={() => setConfirmDeleteOpen(true)}
        >
          Clear Match History
        </button>
      )}
      {confirmDeleteOpen && (
        <>
          <Confirm
            message="Are you sure you want to clear the match history?"
            onConfirm={async () => {
              await clearMatchHistory();
              setConfirmDeleteOpen(false);
              loadMatchHistory();
            }}
            onCancel={() => setConfirmDeleteOpen(false)}
          />
        </>
      )}
    </div>
  ) : (
    <div className={styles.container}>
      None
    </div>
  );
};

export default MatchHistoryPage;