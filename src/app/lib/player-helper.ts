import { Player } from './types';
import { get, post } from './fetch-helper';

const baseUrl = '/api';

export const getPlayers = (): Promise<Player[]> => get(`${baseUrl}/players`);

export const createPlayer = async (player: [Player]): Promise<Player> => {
  const players = await getPlayers();
  const existingPlayer = players.find((p) => p.email === player[0].email);

  if (existingPlayer) {
    throw new Error('Player with this email already exists');
  }

  players.push(player[0]);
  return post(`${baseUrl}/players`, players)
};

export const deletePlayer = async (player: Player): Promise<Player> => {
  const players = await getPlayers();
  const newPlayers = players.filter((p) => p.id !== player.id);
  return post(`${baseUrl}/players`, newPlayers);
};