"use client";
import { useEffect, useState } from "react";
import Table from "../components/Table/Table";
import styles from "./page.module.css";
import { createPlayer, deletePlayer, getPlayers } from "../lib/player-helper";

const PlayersPage = () => {
  const columns = ["Name", "email", "Phone"];
  const [players, setPlayers] = useState<string[][]>([[]]);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data.map((player) => [player.id, player.name, player.email, player.phone]));
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onSavePlayers = async (newPlayer: any) => {
    await createPlayer([newPlayer]);
    setPlayers([...players, [newPlayer.name, newPlayer.email, newPlayer.phone]]);
  };

  const displayPlayers = players.map((player) => [player[1], player[2], player[3]]);

  const onDeletePlayers = async (index: number) => {
    const player = players[index];
    await deletePlayer({ id: player[0], name: player[0], email: player[1], phone: player[2] });
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Players</h1>
      <Table
        allowAdd
        columns={columns}
        data={displayPlayers}
        deleteEnabled
        editable
        onDeleteClick={onDeletePlayers}
        onSave={onSavePlayers}
      />
    </div>
  );
};

export default PlayersPage;
