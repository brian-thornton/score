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
import ScoreEdit from "@/app/components/ScoreEdit/ScoreEdit";

import { createNewMatch, updateScore, editScore } from "@/app/lib/target-number-manager";

const TargetNumberPage = () => {
  const [players, setPlayers] = useState<string[][]>([[]]);
  const [matchPlayers, setMatchPlayers] = useState<string[][]>([]);
  const [match, setMatch] = useState<Match>();
  const [targetNumber, setTargetNumber] = useState<number>(21);
  const columns = ["Name", "email", "Phone"];
  const displayPlayers = players.map((player) => [player.name, player.email, player.phone]);
  const [editRound, setEditRound] = useState<number>(0);
  const [editPlayer, setEditPlayer] = useState();

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onMatchPlayerAdd = async (rowObject: any) => {
    const player = players.find((player) => player.email === rowObject[1]);
    setMatchPlayers([...matchPlayers, player]);
  }

  const onScoreChange = (match: Match, score: number) => {
    const updatedMatch = updateScore(match, score);
    setMatch(updatedMatch);
  }

  const onScoreClick = (player: any, round: number) => {
    setEditPlayer(player);
    setEditRound(round);
  };

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers, targetNumber));
  };

  const minRoundOrZero = () => {
    if (match.currentRound - 10 < 0) {
      return 1;
    }
    return match.currentRound - 9;
  }

  const endMatch = () => {
    window.location.reload();
  }

  if (editPlayer) {
    return (
      <div className={styles.container}>
        <GameHeader title="Edit Score" />
        <ScoreEdit
          onSave={(score) => {
            const updatedMatch = editScore(match, editPlayer, editRound, score);
            setMatch(updatedMatch);
            setEditPlayer(undefined);
          }}
          onCancel={() => setEditPlayer(undefined)}
          currentScore={editPlayer.roundScores[editRound - 1]}
          round={`Round ${editRound}`}
          playerName={editPlayer.player.name}
          possibleScores={[0, 1, 2, 3, 4, 5, 6]}
        />
      </div>
    );
  };

  return match ? (
    <div className={styles.container}>
      <GameHeader title={`Target Number - First to ${match.targetNumber}`} />
      <MatchTable onScoreClick={onScoreClick} match={match} displayEndRound={minRoundOrZero() + 10} displayStartRound={minRoundOrZero()} />
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
      <div className={styles.controlsRow}>
        <input className={styles.targetNumberInput} type="text" placeholder="Target" onChange={(e) => setTargetNumber(parseInt(e.target.value))} />
        <button
          disabled={matchPlayers.length === 0}
          className={styles.controlButton}
          onClick={onStartMatch}>
          Start Match
        </button>
      </div>
    </div>
  );

};

export default TargetNumberPage;
