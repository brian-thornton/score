import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";
import { saveMatchToHistory } from "./match-history-helper";
import { v4 } from "uuid";

export const createNewMatch = (players: Player[], targetNumber: number): Match => {
  const matchPlayers = players.map((player) => ({
    player,
    score: 0,
    roundScores: [],
    isActive: true,
  }));

  return {
    id: v4(),
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

export const editScore = (match: Match, player: MatchPlayer, round: number, score: number): Match => {
  const updatedMatchPlayers = match.matchPlayers.map((matchPlayer) => {
    if (matchPlayer.player.id === player.player.id) {
      const updatedRoundScores = [...matchPlayer.roundScores];
      updatedRoundScores[round - 1] = score;
      return {
        ...matchPlayer,
        roundScores: updatedRoundScores,
        score: updatedRoundScores.reduce((total, roundScore) => total + roundScore, 0),
      };
    }
    return matchPlayer;
  });

  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    isComplete: isGameComplete(updatedMatchPlayers, match),
    winner: isGameComplete(updatedMatchPlayers, match) ? matchWinner(updatedMatchPlayers) : null,
  };

  if (isGameComplete(updatedMatchPlayers, match)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

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
    currentPlayer: match.targetNumber !== undefined && isGameComplete(updatedMatchPlayers, match.targetNumber) ? null : {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete: match.targetNumber !== undefined && isGameComplete(updatedMatchPlayers, match.targetNumber),
    winner: isGameComplete(updatedMatchPlayers, match.targetNumber) ? matchWinner(updatedMatchPlayers, match.targetNumber) : null,
    maxRounds: match.maxRounds,
  };

  if (isGameComplete(updatedMatchPlayers, match.targetNumber)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};