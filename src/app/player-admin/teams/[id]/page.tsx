"use client";
import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import { updateTeam, getTeams } from "../../../lib/api-clients/teams-helper";
import { useParams } from "next/navigation";
import { getPlayers } from "@/app/lib/api-clients/player-helper";
import styles from "./page.module.css";
import { Player, Team } from "../../../lib/types";

const TeamPage = () => {
  const params = useParams();
  const { id } = params;
  const columns = ["Name", "Email", "Phone"];
  const [team, setTeam] = useState<Team>();
  const [playerRows, setPlayerRows] = useState<string[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<string[][]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    const data = await getTeams();
    const currentTeam = data.find((team) => team.id === id);
    setTeam(currentTeam);
    setTeamPlayers(currentTeam?.players?.map((player) => [player.name, player.email, player.phone]) ?? []);

    const playerData = await getPlayers();
    setPlayers(playerData);
    const playersNotOnTeam = playerData.filter((player) => !currentTeam?.players?.find((teamPlayer) => teamPlayer.email === player.email));
    setPlayerRows(playersNotOnTeam.map((player) => [player.name, player.email, player.phone]) ?? []);
  }

  const onAddToTeam = async (rowObject: any) => {
    setTeamPlayers([...teamPlayers, rowObject]);
    const addedPlayer = players.find((player) => player.email === rowObject[1]);

    await updateTeam({
      ...team,
      players: addedPlayer ? (team?.players ? [...team.players, addedPlayer] : [addedPlayer]) : team?.players,
    });

    await loadData();
  };

  const onRemoveFromTeam = async (index: number) => {
    const player = teamPlayers ? teamPlayers[index] : null;

    if (!player) {
      return;
    }

    await updateTeam({
      ...team,
      players: team?.players?.filter((p) => p.email !== player[1]),
    });

    setTeamPlayers(teamPlayers?.filter((_, i) => i !== index));
    setPlayerRows([...playerRows, player]);
    await loadData();
  };

  const filteredPlayers = playerRows.filter(player => 
    (player[0]?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (player[1]?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Team Builder: {team?.name}</h1>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tablesContainer}>
        <div className={styles.tableSection}>
          <h2>Available Players</h2>
          <Table
            columns={columns}
            data={filteredPlayers}
            editable
            emptyText="All players have been assigned to the team."
            enableFilter={false}
            onRowAddClick={onAddToTeam}
            selectable
            deleteEnabled={false}
          />
        </div>

        <div className={styles.tableSection}>
          <h2>Team Players</h2>
          <Table
            columns={columns}
            data={teamPlayers}
            deleteEnabled
            emptyText="No players have been added to the team."
            onDeleteClick={onRemoveFromTeam}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
