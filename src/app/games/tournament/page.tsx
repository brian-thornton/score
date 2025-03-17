"use client";
import { useEffect, useState } from "react";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Match } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";
import GameHeader from "@/app/components/GameHeader/GameHeader";
import { getPlayers } from "@/app/lib/player-helper";
import Table from "@/app/components/Table/Table";

import { createNewMatch, updateScore } from "@/app/lib/singles-tournament-manager";

const TournamentPage = () => {
  const [players, setPlayers] = useState<string[][]>([[]]);
  const [matchPlayers, setMatchPlayers] = useState<string[][]>([]);
  const [match, setMatch] = useState<Match>();
  const columns = ["Name", "email", "Phone"];
  const displayPlayers = players.map((player) => [player.name, player.email, player.phone]);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onScoreChange = (match: Match, score: number) => {
    const updatedMatch = updateScore(match, score);
    setMatch(updatedMatch);
  }

  const onMatchPlayerAdd = async (rowObject: any) => {
    const player = players.find((player) => player.email === rowObject[1]);
    setMatchPlayers([...matchPlayers, player]);
    console.log(player);
  }

  const endMatch = () => {
    window.location.reload();
  }

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers));
  };

  return (
    match ? (
      <div className={styles.container}>
        <GameHeader title="Singles Match" />
        <MatchTable match={match} />
        {!match.isComplete && (
          <>
            <ScoreInput possibleScores={[0, 1, 2, 3, 4, 5, 6]} onChange={onScoreChange} match={match} />
            <button className={styles.controlButton} onClick={endMatch}>End Match</button>
          </>
        )}
        {match.isComplete && (
          <>
            <MatchResult match={match} />
            <div className={styles.controlsRow}>
              <button className={styles.controlButton} onClick={endMatch}>End Match</button>
              <button
                disabled={matchPlayers.length === 0}
                className={styles.controlButton}
                onClick={onStartMatch}>
                Play Again
              </button>
            </div>
          </>
        )}
      </div>
    ) : (
      <div className={styles.container}>
        <Table
          enableFilter
          columns={columns}
          data={displayPlayers}
          deleteEnabled
          editable
          allowAdd={false}
          selectable
          onRowAddClick={onMatchPlayerAdd}
        />
        <button
          disabled={matchPlayers.length === 0}
          className={styles.controlButton}
          onClick={onStartMatch}>
          Start Match
        </button>
      </div>
    )
  );
};

export default TournamentPage;
