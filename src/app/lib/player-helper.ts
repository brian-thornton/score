import { Player } from './types';

const baseUrl = 'http://localhost:3000/api';

export const getPlayers = (): Promise<Player[]> => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/players`;
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

export const createPlayer = async (player: [Player]): Promise<Player> => {
  return new Promise(async (resolve, reject) => {

    const players = await getPlayers();
    const existingPlayer = players.find((p) => p.email === player[0].email);

    if (existingPlayer) {
      reject('Player with this email already exists');
      return;
    }

    players.push(player[0]);

    const url = `${baseUrl}/players`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(players),
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

export const deletePlayer = async (player: Player): Promise<Player> => {
  return new Promise(async (resolve, reject) => {
    const players = await getPlayers();
    const newPlayers = players.filter((p) => p.email !== player.email);

    const url = `${baseUrl}/players`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayers),
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