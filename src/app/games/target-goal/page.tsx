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
import MatchGoalTable from "@/app/components/MatchGoalTable/MatchGoalTable";
import TargetList from "@/app/components/TargetList/TargetList";
import { createTargetSet } from "@/app/lib/target-set-helper";


import { createNewMatch, updateScore } from "@/app/lib/goal-match-manager";

const TargetGoalPage = () => {
  const [players, setPlayers] = useState<string[][]>([[]]);
  const [matchPlayers, setMatchPlayers] = useState<string[][]>([]);
  const [match, setMatch] = useState<Match>();
  const columns = ["Name", "email", "Phone"];
  const displayPlayers = players.map((player) => [player.name, player.email, player.phone]);
  const [possibleScores, setPossibleScores] = useState<string[]>([]);

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
    console.log(player);
  }

  const onStartMatch = () => {
    setMatch(createNewMatch(matchPlayers));
  };

  const endMatch = () => {
    window.location.reload();
  }

  const onScoreChange = (match: Match, score: string, possibleScores: string[]) => {
    console.log(possibleScores);
    const updatedMatch = updateScore(match, score, possibleScores);
    setMatch(updatedMatch);
  };

  const onTargetListChange = (targetSet) => {
    setPossibleScores(targetSet.targets);
    createTargetSet(targetSet);
  }

  return match ? (
    <div className={styles.container}>
      <GameHeader title="Target Goal" />
      <MatchGoalTable match={match} headers={possibleScores}/>
      {!match.isComplete && (
        <>
          <ScoreInput possibleScores={possibleScores} match={match} onChange={onScoreChange} />
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
      <TargetList onTargetsChange={onTargetListChange} />
      <div className={styles.controlsRow}>
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

export default TargetGoalPage;
