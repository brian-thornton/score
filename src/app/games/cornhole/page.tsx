"use client";
import { useEffect, useState } from "react";
import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Player, Match, MatchPlayer } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";
import GameHeader from "@/app/components/GameHeader/GameHeader";
import { getPlayers } from "@/app/lib/api-clients/player-helper";
import Table from "@/app/components/Table/Table";
import { createNewMatch, updateScore } from "@/app/lib/cornhole-manager";
import MatchTable from "@/app/components/MatchTable/MatchTable";
import { saveMatchToHistory } from "@/app/lib/api-clients/match-history-helper";

const CornholePage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matchPlayers, setMatchPlayers] = useState<MatchPlayer[]>([]);
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

  const onScoreChange = (match: Match, score: number | string, possibleScores: string[] | undefined, playerId: string) => {
    if (match) {
      const updatedMatch = updateScore(match, playerId, Number(score));
      setMatch(updatedMatch);
      if (updatedMatch.isComplete) {
        saveMatchToHistory(updatedMatch);
      }
    }
  };

  const onMatchPlayerAdd = async (rowObject: any) => {
    const player = players.find((player) => player.email === rowObject[1]);
    if (player && matchPlayers.length < 2) { // Only allow 2 players for Cornhole
      setMatchPlayers([...matchPlayers, { player: player, score: 0, roundScores: [], isActive: false }]);
    }
  };

  const endMatch = () => {
    window.location.reload();
  };

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers));
  };

  const minRoundOrZero = () => {
    if (!match) return 0;
    return match.currentRound - 10 < 0 ? 1 : match.currentRound - 9;
  };

  if (match) {
    return (
      <div className={styles.container}>
        <MatchTable
          match={match}
          displayEndRound={minRoundOrZero() + 10}
          displayStartRound={minRoundOrZero()}
        />
        <div className={styles.scoreInputsContainer}>
          {match.matchPlayers.map((matchPlayer: MatchPlayer) => (
            <div key={matchPlayer.player.id} className={styles.playerScoreSection}>
              <h3 className={styles.playerName}>{matchPlayer.player.name}</h3>
              <div className={styles.scoreButtons}>
                {[0, 1, 2, 3].map((score) => (
                  <button
                    key={score}
                    className={styles.scoreButton}
                    onClick={() => onScoreChange(match, score, undefined, matchPlayer.player.id)}
                    disabled={match.isComplete}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!match.isComplete && (
          <button className={styles.controlButton} onClick={endMatch}>End Match</button>
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Cornhole Setup</h1>
        </div>
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
              <h2 className={styles.sectionTitle}>Players for Match ({matchPlayers.length}/2)</h2>
              {matchPlayers.length > 0 ? (
                <Table
                  columns={columns}
                  data={matchPlayers.map(p => [p.player.name, p.player.email, p.player.phone])}
                  deleteEnabled={true}
                  editable={false}
                  allowAdd={false}
                  selectable={false}
                  onDeleteClick={(index) => {
                    setMatchPlayers(matchPlayers.filter((_, i) => i !== index));
                  }}
                />
              ) : (
                <p>Select up to 2 players from the left.</p>
              )}
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Match Controls</h2>
              <div className={styles.controlsRow}>
                <button
                  disabled={matchPlayers.length !== 2}
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

export default CornholePage; 