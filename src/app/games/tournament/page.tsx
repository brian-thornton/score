"use client";
import { useState } from "react";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Match } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";

import { createNewMatch, updateScore } from "@/app/lib/singles-tournament-manager";

const TournamentPage = () => {
  const matchPlayers = [
    { id: 'aaa', email: 'aaa', phone: 'aaa', name: "Player 1", isActive: true },
    { id: 'bbb', email: 'bbb', phone: 'aaa', name: "Player 2", isActive: true },
    { id: 'ccc', email: 'ccc', phone: 'aaa', name: "Player 3", isActive: true },
    { id: 'ddd', email: 'ddd ', phone: 'aaa', name: "Player 4", isActive: true },
  ];

  const [match, setMatch] = useState<Match>(createNewMatch(matchPlayers));

  const onScoreChange = (match: Match, score: number) => {
    const updatedMatch = updateScore(match, score);
    setMatch(updatedMatch);
  }

  return (
    <div className={styles.container}>
      <MatchTable match={match} />
      {!match.isComplete && <ScoreInput possibleScores={[1, 2, 3, 4, 5, 6]} onChange={onScoreChange} match={match} />}
      {match.isComplete && <MatchResult match={match} />}
    </div>
  );
};

export default TournamentPage;
