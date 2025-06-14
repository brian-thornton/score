"use client";
import { useEffect, useState } from "react";

import ScoreInput from "@/app/components/ScoreInput/ScoreInput";
import { Match } from "@/app/lib/types";
import styles from "./page.module.css";
import MatchResult from "@/app/components/MatchResult/MatchResult";
import GameHeader from "@/app/components/GameHeader/GameHeader";
import { getPlayers } from "@/app/lib/api-clients/player-helper";
import Table from "@/app/components/Table/Table";
import MatchGoalTable from "@/app/components/MatchGoalTable/MatchGoalTable";
import TargetList from "@/app/components/TargetList/TargetList";
import { saveTargetSet } from "@/app/lib/api-clients/target-set-helper";
import { createNewMatch, updateScore } from "@/app/lib/goal-match-manager";

const TargetGoalPage = () => {
  const [players, setPlayers] = useState<any>([[]]);
  const [matchPlayers, setMatchPlayers] = useState<any>([]);
  const [match, setMatch] = useState<Match>();
  const columns = ["Name", "email", "Phone"];
  const displayPlayers = players.map((player: any) => [player.name, player.email, player.phone]);
  const [possibleScores, setPossibleScores] = useState<string[]>([]);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onMatchPlayerAdd = async (rowObject: any) => {
    const player = players.find((player: any) => player.email === rowObject[1]);
    setMatchPlayers([...matchPlayers, player]);
  }

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers));
  };

  const endMatch = () => {
    window.location.reload();
  }

  const onScoreChange = (match: Match, score: string | number, possibleScores: string[] | undefined) => {
    const updatedMatch = updateScore(match, String(score), possibleScores || []);
    setMatch(updatedMatch);
  };

  const onTargetListChange = (targetSet: any) => {
    setPossibleScores(targetSet.targets);
    saveTargetSet(targetSet);
  }

  return match ? (
    <div className={styles.container}>
      <div style={{ width: '100%', margin: 0, padding: 0 }}>
        <MatchGoalTable match={match} headers={possibleScores}/>
      </div>
      {!match.isComplete && (
        <>
          <ScoreInput possibleScores={possibleScores} match={match} onChange={onScoreChange} hideBullseye={true} />
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
    <div className={styles.setupContainer}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Available Players</h2>
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
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Target Configuration</h2>
            <TargetList onTargetsChange={onTargetListChange} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Match Controls</h2>
            <div className={styles.controlsRow}>
              <button
                disabled={matchPlayers.length === 0}
                className={styles.controlButton}
                onClick={onStartMatch}>
                Start Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetGoalPage;
