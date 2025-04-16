import { Player } from './types';
import { get } from './fetch-helper';

const baseUrl = 'http://localhost:3000/api';

export const getPlayers = (): Promise<Player[]> => get(`${baseUrl}/players`);

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
    const newPlayers = players.filter((p) => p.id !== player.id);
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