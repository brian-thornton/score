"use client";
import { useEffect, useState } from "react";
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "@/app/lib/api-clients/player-helper";
import { Player } from "@/app/lib/types";
import Table from "@/app/components/Table/Table";
import styles from "./page.module.css";
import ErrorModal from "@/app/components/ErrorModal/ErrorModal";
import ConfirmModal from "@/app/components/ConfirmModal/ConfirmModal";

const PlayersPage = () => {
  const columns = ["Name", "Email", "Phone"];
  const [players, setPlayers] = useState<Player[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newPlayer, setNewPlayer] = useState<string[]>(Array(columns.length).fill(""));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const loadPlayers = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const updatedPlayer = [...newPlayer];
    updatedPlayer[index] = value;
    setNewPlayer(updatedPlayer);
  };

  const handleAddPlayer = async () => {
    try {
      const player: Player = {
        id: crypto.randomUUID(),
        name: newPlayer[0],
        email: newPlayer[1],
        phone: newPlayer[2] || "",
      };
      await createPlayer(player);
      loadPlayers();
      setNewPlayer(Array(columns.length).fill(""));
      setIsAdding(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      }
    }
  };

  const onEditClick = async (index: number) => {
    try {
      const player = players[index];
      const updatedPlayer: Player = {
        id: player.id,
        name: player.name,
        email: player.email,
        phone: player.phone || "",
      };
      await updatePlayer(updatedPlayer);
      loadPlayers();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      }
    }
  };

  const onDeleteClick = async (index: number) => {
    const player = players[index];
    setPlayerToDelete(player);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!playerToDelete) return;
    
    try {
      await deletePlayer(playerToDelete.id);
      loadPlayers();
      setIsDeleteModalOpen(false);
      setPlayerToDelete(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      }
    }
  };

  const displayPlayers = players.map((player) => [
    player.name,
    player.email,
    player.phone,
  ]);

  return (
    <div className={styles.container}>
      <h1>Players</h1>
      {!isAdding && (
        <Table
          columns={columns}
          data={displayPlayers}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          deleteEnabled
          editable
          emptyText="No players found"
        />
      )}
      {isAdding ? (
        <div className={styles.addPlayerForm}>
          {columns.map((column, index) => (
            <input
              key={index}
              className={styles.input}
              placeholder={column}
              value={newPlayer[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handleAddPlayer}>Save</button>
            <button className={styles.button} onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className={styles.addButton} onClick={() => setIsAdding(true)}>Add Player</button>
      )}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlayerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Player"
        message={`Are you sure you want to delete ${playerToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PlayersPage;
