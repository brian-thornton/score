"use client";
import { useEffect, useState } from "react";
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "@/app/lib/api-clients/player-helper";
import { Player } from "@/app/lib/types";
import Table from "@/app/components/Table/Table";
import styles from "./page.module.css";
import ErrorModal from "@/app/components/ErrorModal/ErrorModal";

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPlayers = async () => {
    const data = getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const onSavePlayers = async (newPlayer: any) => {
    try {
      const player: Player = {
        id: crypto.randomUUID(),
        name: newPlayer[0],
        email: newPlayer[1],
        phone: newPlayer[2] || "",
      };
      await createPlayer(player);
      loadPlayers();
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
    try {
      const player = players[index];
      await deletePlayer(player.id);
      loadPlayers();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setIsErrorModalOpen(true);
      }
    }
  };

  const columns = ["Name", "Email", "Phone"];
  const displayPlayers = players.map((player) => [
    player.name,
    player.email,
    player.phone,
  ]);

  return (
    <div className={styles.container}>
      <h1>Players</h1>
      <Table
        columns={columns}
        data={displayPlayers}
        onSave={onSavePlayers}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        deleteEnabled
        editable
        allowAdd
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default PlayersPage;
