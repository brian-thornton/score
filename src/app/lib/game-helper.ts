import { Player, Match, MatchPlayer } from "@/app/lib/types";
import { v4 } from "uuid";

export const initMatchPlayers = (players: Player[]): MatchPlayer[] => {
  return players.map((player) => ({
    player,
    score: 0,
    roundScores: [],
    isActive: true,
  }));
};

export const initMatch = (players: Player[], matchType: string, maxRounds: number, targetNumber: number = 0): Match => {
  const matchPlayers = initMatchPlayers(players);

  return {
    id: v4(),
    matchPlayers,
    currentPlayer: players[0],
    currentRound: 1,
    matchType,
    maxRounds,
    isComplete: false,
    winner: null,
    targetNumber
  };
}