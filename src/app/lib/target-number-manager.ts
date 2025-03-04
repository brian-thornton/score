import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";

export const createNewMatch = (players: Player[], targetNumber: number): Match => {
  const matchPlayers = players.map((player) => ({
    player,
    score: 0,
    roundScores: [],
    isActive: true,
  }));

  return {
    id: '1',
    matchPlayers,
    currentPlayer: players[0],
    currentRound: 1,
    matchType: MatchType.TARGET_NUMBER,
    maxRounds: 100,
    isComplete: false,
    winner: null,
    targetNumber,
  };
};

const isGameComplete = (matchPlayers: MatchPlayer[], targetNumber: number): boolean => {
  return matchPlayers.some((player) => player.score >= targetNumber);
};

const matchWinner = (matchPlayers: MatchPlayer[], targetNumber: number): MatchPlayer | null => {
  const maxScore = matchPlayers.reduce((max, player) => Math.max(max, player.score), 0);
  return matchPlayers.find((player) => player.score === maxScore && player.score >= targetNumber) || null;
}

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match.matchPlayers, match.targetNumber)) {
    return match;
  }

  let currentPlayer = match.matchPlayers.find((player) => player.player.id === match.currentPlayer?.id);
  if (!currentPlayer) {
    currentPlayer = match.matchPlayers[0];
  }

  const updatedPlayer = {
    ...currentPlayer,
    score: currentPlayer.score + score,
    roundScores: currentPlayer.roundScores.concat(score),
  };

  const updatedMatchPlayers = match.matchPlayers.map((player) => {
    if (player.player.id === match.currentPlayer.id) {
      return updatedPlayer;
    }
    return player;
  });

  let nextPlayer = nextActivePlayer(updatedMatchPlayers, match.currentPlayer);

  let nextRound = match.currentRound;
  if (isRoundComplete(updatedMatchPlayers, match.currentRound)) {
    nextRound += 1;
  }
  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    currentPlayer: isGameComplete(updatedMatchPlayers, match.targetNumber) ? null : {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete: isGameComplete(updatedMatchPlayers, match.targetNumber),
    winner: isGameComplete(updatedMatchPlayers, match.targetNumber) ? matchWinner(updatedMatchPlayers, match.targetNumber) : null,
    maxRounds: match.maxRounds,
  };
  return updatedMatch;
};