"use client";
import { useEffect, useState } from "react";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Player, Match } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";
import GameHeader from "@/app/components/GameHeader/GameHeader";
import { getPlayers } from "@/app/lib/api-clients/player-helper";
import Table from "@/app/components/Table/Table";
import ScoreEdit from "@/app/components/ScoreEdit/ScoreEdit";

import { createNewMatch, updateScore, editScore } from "@/app/lib/singles-tournament-manager";

const TournamentPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchPlayers, setMatchPlayers] = useState<any>([]);
  const [match, setMatch] = useState<Match>();
  const columns = ["Name", "email", "Phone"];
  const displayPlayers = players.map((player) => [player.name, player.email, player.phone]);
  const [editRound, setEditRound] = useState<number>(0);
  const [editPlayer, setEditPlayer] = useState<any>();

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onScoreChange = (match: Match, score: string | number, possibleScores: string[] | undefined) => {
    const numericScore = typeof score === "string" ? parseInt(score, 10) : score;
    const updatedMatch = updateScore(match, numericScore);
    setMatch(updatedMatch);
  }

  const onMatchPlayerAdd = async (rowObject: any) => {
    const player = players.find((player) => player.email === rowObject[1]);
    setMatchPlayers([...matchPlayers, player]);
  }

  const endMatch = () => {
    window.location.reload();
  }

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers));
  };

  const onScoreClick = (player: any, round: number) => {
    setEditPlayer(player);
    setEditRound(round);
  };

  if (editPlayer) {
    return (
      <div className={styles.container}>
        <GameHeader title="Edit Score" />
        <ScoreEdit
          onSave={(score) => {
            if (match) {
              const updatedMatch = editScore(match, editPlayer, editRound, score);
              setMatch(updatedMatch);
              setEditPlayer(undefined);
            }
          }}
          onCancel={() => setEditPlayer(undefined)}
          currentScore={editPlayer.roundScores[editRound - 1]}
          round={`Round ${editRound}`}
          playerName={editPlayer.player.name}
          possibleScores={["0", "1", "2", "3", "4", "5", "6"]}
        />
      </div>
    );
  }

  return match ? (
    <div className={styles.container}>
      <MatchTable match={match} onScoreClick={onScoreClick} />
      {!match.isComplete && (
        <>
          <ScoreInput possibleScores={[0, 1, 2, 3, 4, 6, 8, 10]} onChange={onScoreChange} match={match} />
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
  );
};

export default TournamentPage;
