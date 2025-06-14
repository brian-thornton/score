"use client";
import { useEffect, useState } from "react";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Player, Match, MatchPlayer } from "@/app/lib/types";
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
    if (player && matchPlayers.length < 4) {
      setMatchPlayers([...matchPlayers, { player: player, score: 0, roundScores: [], isActive: false }]);
    }
  }

  const endMatch = () => {
    window.location.reload();
  }

  const onStartMatch = () => {
    const players = matchPlayers.map((mp: MatchPlayer) => mp.player);
    setMatch(createNewMatch(players));
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

  if (match) {
    return (
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
    );
  } else {
    return (
      <div className={styles.setupContainer}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Available Players</h2>
              <Table
                enableFilter
                columns={columns}
                data={displayPlayers}
                deleteEnabled={false}
                editable={false}
                allowAdd={false}
                selectable
                onRowAddClick={onMatchPlayerAdd}
              />
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Players for Match ({matchPlayers.length}/4)</h2>
              {matchPlayers.length > 0 ? (
                <Table
                  columns={columns}
                  data={matchPlayers.map((p: MatchPlayer) => [p.player.name, p.player.email, p.player.phone])}
                  deleteEnabled={true}
                  editable={false}
                  allowAdd={false}
                  selectable={false}
                  onDeleteClick={(index: number) => {
                    setMatchPlayers(matchPlayers.filter((_: any, i: number) => i !== index));
                  }}
                />
              ) : (
                <p>Select up to 4 players from the left.</p>
              )}
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Match Controls</h2>
              <div className={styles.controlsRow}>
                <button
                  disabled={matchPlayers.length < 2 || matchPlayers.length > 4}
                  className={styles.startMatchButton}
                  onClick={onStartMatch}>
                  Start Match
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TournamentPage;
