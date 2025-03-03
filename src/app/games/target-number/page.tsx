"use client";
import { useState } from "react";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Match } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";

import { createNewMatch, updateScore } from "@/app/lib/target-number-manager";

const TargetNumberPage = () => {
  const matchPlayers = [
    { id: 'aaa', email: 'aaa', phone: 'aaa', name: "Player 1", isActive: true },
    { id: 'bbb', email: 'bbb', phone: 'aaa', name: "Player 2", isActive: true },
    { id: 'ccc', email: 'ccc', phone: 'aaa', name: "Player 3", isActive: true },
    { id: 'ddd', email: 'ddd ', phone: 'aaa', name: "Player 4", isActive: true },
  ];

  const [match, setMatch] = useState<Match>(createNewMatch(matchPlayers, 20));

  const onScoreChange = (match: Match, score: number) => {
    const updatedMatch = updateScore(match, score);
    setMatch(updatedMatch);
  }

  const minRoundOrZero = () => {
    if (match.currentRound - 10 < 0) {
      return 1;
    }
    return match.currentRound - 9;
  }

  return (
    <div className={styles.container}>
      <MatchTable match={match} displayEndRound={minRoundOrZero() + 10} displayStartRound={minRoundOrZero()} />
      {!match.isComplete && <ScoreInput possibleScores={[1, 2, 3, 4, 5, 6]} onChange={onScoreChange} match={match} />}
      {match.isComplete && <MatchResult match={match} />}
    </div>
  );
};

export default TargetNumberPage;
