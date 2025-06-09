import { Player } from '../types';
import { get, post } from './fetch-helper';

const baseUrl = '/api';
const STORAGE_KEY = 'players';

export const getPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading players:', error);
    return [];
  }
};

export const createPlayer = (player: Player): Promise<Player> => {
  return new Promise((resolve, reject) => {
    try {
      const players = getPlayers();
      
      // Validate name
      if (!player.name || player.name.trim() === '') {
        reject(new Error('Name cannot be blank'));
        return;
      }

      // Validate email
      if (!player.email || player.email.trim() === '') {
        reject(new Error('Email cannot be blank'));
        return;
      }

      // Check for duplicate email
      const existingPlayer = players.find(p => p.email.toLowerCase() === player.email.toLowerCase());
      if (existingPlayer) {
        reject(new Error('A player with this email already exists'));
        return;
      }

      players.push(player);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      resolve(player);
    } catch (error) {
      console.error('Error creating player:', error);
      reject(error);
    }
  });
};

export const updatePlayer = (player: Player): Promise<Player> => {
  return new Promise((resolve, reject) => {
    try {
      const players = getPlayers();
      
      // Validate name
      if (!player.name || player.name.trim() === '') {
        reject(new Error('Name cannot be blank'));
        return;
      }

      // Validate email
      if (!player.email || player.email.trim() === '') {
        reject(new Error('Email cannot be blank'));
        return;
      }

      // Check for duplicate email (excluding the current player)
      const existingPlayer = players.find(p => 
        p.email.toLowerCase() === player.email.toLowerCase() && 
        p.id !== player.id
      );
      if (existingPlayer) {
        reject(new Error('A player with this email already exists'));
        return;
      }

      const index = players.findIndex(p => p.id === player.id);
      if (index === -1) {
        reject(new Error('Player not found'));
        return;
      }

      players[index] = player;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      resolve(player);
    } catch (error) {
      console.error('Error updating player:', error);
      reject(error);
    }
  });
};

export const deletePlayer = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const players = getPlayers();
      const filteredPlayers = players.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlayers));
      resolve();
    } catch (error) {
      console.error('Error deleting player:', error);
      reject(error);
    }
  });
};