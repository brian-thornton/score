import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";
import { saveMatchToHistory } from "./api-clients/match-history-helper";
import { initMatch } from "./game-helper";

export const createNewMatch = (players: Player[], targetNumber: number): Match => {
  return initMatch(players, MatchType.TARGET_NUMBER, 100, targetNumber);
};

const isGameComplete = (matchPlayers: MatchPlayer[], targetNumber: number): boolean => {
  return matchPlayers.some((player) => Number(player.score) >= targetNumber);
};

const matchWinner = (matchPlayers: MatchPlayer[], targetNumber: number): MatchPlayer | null => {
  const maxScore = matchPlayers.reduce((max, player) => Math.max(max, Number(player.score)), 0);
  return matchPlayers.find((player) => player.score === maxScore && player.score >= targetNumber) || null;
}

export const editScore = (match: Match, player: MatchPlayer, round: number, score: number): Match => {
  const updatedMatchPlayers = match?.matchPlayers.map((matchPlayer) => {
    if (matchPlayer.player.id === player.player.id) {
      const updatedRoundScores = [...matchPlayer.roundScores];
      updatedRoundScores[round - 1] = score;
      return {
        ...matchPlayer,
        roundScores: updatedRoundScores,
        score: updatedRoundScores.reduce((total, roundScore) => Number(total) + Number(roundScore), 0),
      };
    }
    return matchPlayer;
  });

  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    isComplete: isGameComplete(updatedMatchPlayers, match?.targetNumber ?? 0),
    winner: isGameComplete(updatedMatchPlayers, match?.targetNumber ?? 0) ? matchWinner(updatedMatchPlayers, match?.targetNumber ?? 0) : null,
  };

  if (isGameComplete(updatedMatchPlayers, match.targetNumber ?? 0)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match.matchPlayers, match.targetNumber ?? 0)) {
    return match;
  }

  let currentPlayer = match.matchPlayers.find((player) => player.player.id === match.currentPlayer?.id);
  if (!currentPlayer) {
    currentPlayer = match.matchPlayers[0];
  }

  const updatedPlayer = {
    ...currentPlayer,
    score: Number(currentPlayer.score) + score,
    roundScores: currentPlayer.roundScores.concat(score),
  };

  const updatedMatchPlayers = match.matchPlayers.map((player) => {
    if (player.player.id === match.currentPlayer?.id) {
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
    isComplete: match.targetNumber !== undefined && isGameComplete(updatedMatchPlayers, match.targetNumber ?? 0),
    winner: isGameComplete(updatedMatchPlayers, match.targetNumber ?? 0) ? matchWinner(updatedMatchPlayers, match.targetNumber ?? 0) : null,
    maxRounds: match.maxRounds,
  };

  if (isGameComplete(updatedMatchPlayers, match.targetNumber ?? 0)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};