import { Team } from './types';

const baseUrl = 'http://localhost:3000/api';

export const getTeams = (): Promise<Team[]> => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/teams`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createTeam = async (team: [Team]): Promise<Team> => {
  return new Promise(async (resolve, reject) => {

    let teams = await getTeams();

    if (teams.length > 0) {
      teams.push(team[0]);
    } else {
      teams = [team][0];
    }

    const url = `${baseUrl}/teams`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teams),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateTeam = async (team: Team): Promise<Team> => {
  return new Promise(async (resolve, reject) => {
    const teams = await getTeams();
    const newTeams = teams.map((t) => {
      if (t.name === team.name) {
        return team;
      }
      return t;
    });

    const url = `${baseUrl}/teams`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeams),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteTeam = async (team: Team): Promise<Team> => {
  return new Promise(async (resolve, reject) => {
    const teams = await getTeams();
    const newTeams = teams.filter((t) => t.id !== team.id);

    const url = `${baseUrl}/teams`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeams),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};