"use client";
import { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import { createTeam, deleteTeam, getTeams } from "../../lib/api-clients/teams-helper";
import { Team } from "../../lib/types";
import styles from "./page.module.css";

const TeamsPage = () => {
  const columns = ["Name"];
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamRows, setTeamRows] = useState<[string[]]>([[]]);

  const loadTeams = async () => {
    const data = await getTeams();
    setTeams(data);
    setTeamRows(data?.length > 0 ? data.map((team) => [team.name]) : [[]]);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const onDeleteClick = async (index: number) => {
    const team = teams[index];
    await deleteTeam({ id: team.id });
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    await loadTeams();
  };

  const onSaveTeams = async (newTeam: any) => {
    await createTeam([newTeam]);
    setTeams([...teams, [newTeam.name]]);
    await loadTeams();
  };

  const onEditClick = (index: Number) => {
    window.location.replace(`/player-admin/teams/${teams[index].id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Teams</h1>
      <Table
        columns={columns}
        data={teamRows}
        onDeleteClick={onDeleteClick}
        onEditClick={onEditClick}
        onSave={onSaveTeams}
        editable
        allowAdd
        deleteEnabled
      />
    </div>
  );
};

export default TeamsPage;
