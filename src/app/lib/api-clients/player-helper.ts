import { Player } from '../types';
import { get, post } from './fetch-helper';

const baseUrl = '/api';

export const getPlayers = (): Promise<Player[]> => get(`${baseUrl}/players`);

export const createPlayer = async (player: [Player]): Promise<Player> => {
  const players = await getPlayers();
  players.push(player[0]);
  return post(`${baseUrl}/players`, players)
};

export const updatePlayer = async (updatedPlayer: Player): Promise<Player> => {
  const players = await getPlayers();
  const playerIndex = players.findIndex((p) => p.id === updatedPlayer.id);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }

  players[playerIndex] = updatedPlayer;
  return post(`${baseUrl}/players`, players);
};

export const deletePlayer = async (player: Player): Promise<Player> => {
  const players = await getPlayers();
  const newPlayers = players.filter((p) => p.id !== player.id);
  return post(`${baseUrl}/players`, newPlayers);
};