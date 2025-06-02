"use client";
import { useEffect, useState } from "react";

import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Match, MatchPlayer, Player } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";
import GameHeader from "@/app/components/GameHeader/GameHeader";
import { getPlayers } from "@/app/lib/api-clients/player-helper";
import Table from "@/app/components/Table/Table";
import ScoreEdit from "@/app/components/ScoreEdit/ScoreEdit";
import { createNewMatch, updateScore, editScore } from "@/app/lib/target-number-manager";

const POSSIBLE_SCORES = [0, 1, 2, 3, 4, 5, 6];
const DEFAULT_TARGET_NUMBER = 21;
const TABLE_COLUMNS = ["Name", "email", "Phone"];

type PlayerTableRow = [string, string, string];

const TargetNumberPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchPlayers, setMatchPlayers] = useState<Player[]>([]);
  const [match, setMatch] = useState<Match | undefined>();
  const [targetNumber, setTargetNumber] = useState<number>(DEFAULT_TARGET_NUMBER);
  const [editRound, setEditRound] = useState<number>(0);
  const [editPlayer, setEditPlayer] = useState<MatchPlayer | undefined>();

  const displayPlayers: PlayerTableRow[] = players.map((player) => [
    player.name,
    player.email,
    player.phone,
  ]);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  const onMatchPlayerAdd = (rowObject: PlayerTableRow) => {
    const player = players.find((player) => player.email === rowObject[1]);
    if (player) {
      setMatchPlayers((prev) => [...prev, player]);
    }
  };

  const onScoreChange = (match: Match, score: string | number) => {
    const numericScore = typeof score === "string" ? parseInt(score) : score;
    const updatedMatch = updateScore(match, numericScore);
    setMatch(updatedMatch);
  };

  const onScoreClick = (player: MatchPlayer, round: number) => {
    setEditPlayer(player);
    setEditRound(round);
  };

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers, targetNumber));
  };

  const minRoundOrZero = () => {
    if (!match) return 0;
    return match.currentRound - 10 < 0 ? 1 : match.currentRound - 9;
  };

  const endMatch = () => {
    window.location.reload();
  };

  const handleScoreEdit = (score: number) => {
    if (match && editPlayer) {
      const updatedMatch = editScore(match, editPlayer, editRound, score);
      setMatch(updatedMatch);
      setEditPlayer(undefined);
    }
  };

  if (editPlayer) {
    return (
      <div className={styles.container}>
        <GameHeader title="Edit Score" />
        {match && (
          <ScoreEdit
            onSave={handleScoreEdit}
            onCancel={() => setEditPlayer(undefined)}
            currentScore={Number(editPlayer.roundScores[editRound - 1])}
            round={`Round ${editRound}`}
            playerName={editPlayer.player.name}
            possibleScores={POSSIBLE_SCORES.map(String)}
          />
        )}
      </div>
    );
  }

  if (!match) {
    return (
      <div className={styles.container}>
        <Table
          enableFilter
          columns={TABLE_COLUMNS}
          data={displayPlayers}
          deleteEnabled
          editable
          allowAdd={false}
          selectable
          onRowAddClick={onMatchPlayerAdd}
        />
        <div className={styles.controlsRow}>
          <input
            className={styles.targetNumberInput}
            type="number"
            placeholder="Target"
            value={targetNumber}
            onChange={(e) => setTargetNumber(parseInt(e.target.value) || DEFAULT_TARGET_NUMBER)}
          />
          <button
            disabled={matchPlayers.length === 0}
            className={styles.controlButton}
            onClick={onStartMatch}
          >
            Start Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MatchTable
        onScoreClick={onScoreClick}
        match={match}
        displayEndRound={minRoundOrZero() + 10}
        displayStartRound={minRoundOrZero()}
      />
      {!match.isComplete && (
        <>
          <ScoreInput
            possibleScores={POSSIBLE_SCORES}
            onChange={onScoreChange}
            match={match}
          />
          <button className={styles.controlButton} onClick={endMatch}>
            End Match
          </button>
        </>
      )}
      {match.isComplete && (
        <>
          <MatchResult match={match} />
          <div className={styles.controlsRow}>
            <button className={styles.controlButton} onClick={endMatch}>
              End Match
            </button>
            <button
              disabled={matchPlayers.length === 0}
              className={styles.controlButton}
              onClick={onStartMatch}
            >
              Play Again
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TargetNumberPage;
