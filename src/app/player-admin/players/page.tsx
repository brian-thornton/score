"use client";
import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import PlayerEdit from "../../components/PlayerEdit/PlayerEdit";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";
import styles from "./page.module.css";
import { createPlayer, deletePlayer, getPlayers, updatePlayer } from "../../lib/api-clients/player-helper";
import { Player } from "../../lib/types";

const columns = ["ID", "Name", "email", "Phone"];

const PlayersPage = () => {
  const [players, setPlayers] = useState<string[][]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<{ id: string; name: string } | null>(null);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data.map((player) => [player.id, player.name, player.email, player.phone]));
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onSavePlayers = async (newPlayer: any) => {
    await createPlayer([newPlayer]);
    loadPlayers();
  };

  // Pass all columns (including ID) to Table, but hide ID in display
  const displayPlayers = players.map((player) => [player[0], player[1], player[2], player[3]]);

  const onDeletePlayers = async (index: number) => {
    const playerId = displayPlayers[index][0];
    const player = players.find((p) => p[0] === playerId);
    if (player) {
      setDeletingPlayer({ id: player[0], name: player[1] });
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingPlayer) {
      const player = players.find((p) => p[0] === deletingPlayer.id);
      if (player) {
        await deletePlayer({ id: player[0], name: player[1], email: player[2], phone: player[3] });
        loadPlayers();
      }
      setDeletingPlayer(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPlayer(null);
  };

  // Use player ID to find the correct player for editing
  const onEditClick = (index: number) => {
    const playerId = displayPlayers[index][0];
    const player = players.find((p) => p[0] === playerId);
    if (player) {
      setEditingPlayer({
        id: player[0],
        name: player[1],
        email: player[2],
        phone: player[3],
      });
    }
  };

  const onSaveEdit = async (player: Player) => {
    await updatePlayer(player);
    setEditingPlayer(null);
    loadPlayers();
  };

  const onCancelEdit = () => setEditingPlayer(null);

  return (
    <div className={styles.container}>
      {editingPlayer ? (
        <PlayerEdit player={editingPlayer} onSave={onSaveEdit} onCancel={onCancelEdit} />
      ) : (
        <>
          <Table
            allowAdd
            columns={columns.slice(1)} // Hide ID column in header
            data={displayPlayers.map(row => row.slice(1))} // Hide ID column in display
            deleteEnabled
            editable
            onDeleteClick={onDeletePlayers}
            onSave={onSavePlayers}
            onEditClick={onEditClick}
          />
          {deletingPlayer && (
            <DeleteConfirmation
              itemName={deletingPlayer.name}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PlayersPage;
