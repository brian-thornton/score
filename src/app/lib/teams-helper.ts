import { Team } from './types';
import { get, post } from './fetch-helper';

const baseUrl = 'http://localhost:3000/api';

export const getTeams = (): Promise<Team[]> => get(`${baseUrl}/teams`);

export const createTeam = async (team: [Team]): Promise<Team> => {
    let teams = await getTeams();

    if (teams.length > 0) {
      teams.push(team[0]);
    } else {
      teams = [team][0];
    }

    const url = `${baseUrl}/teams`;
    return post(url, teams);
};

export const updateTeam = async (team: Team): Promise<Team> => {
    const teams = await getTeams();
    const newTeams = teams.map((t) => {
      if (t.name === team.name) {
        return team;
      }
      return t;
    });

    const url = `${baseUrl}/teams`;
    return post(url, newTeams);
};

export const deleteTeam = async (team: Team): Promise<Team> => {
    const teams = await getTeams();
    const newTeams = teams.filter((t) => t.id !== team.id);

    const url = `${baseUrl}/teams`;
    return post(url, newTeams);
};