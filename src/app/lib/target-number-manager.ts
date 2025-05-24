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
};

const updatePlayerScore = (
  player: MatchPlayer,
  score: number,
  round?: number
): MatchPlayer => {
  const updatedRoundScores = round !== undefined
    ? player.roundScores.map((s, i) => i === round - 1 ? score : s)
    : [...player.roundScores, score];

  return {
    ...player,
    roundScores: updatedRoundScores,
    score: updatedRoundScores.reduce((total, roundScore) => Number(total) + Number(roundScore), 0),
  };
};

const updateMatchState = (
  match: Match,
  updatedPlayers: MatchPlayer[]
): Match => {
  const targetNumber = match.targetNumber ?? 0;
  const isComplete = isGameComplete(updatedPlayers, targetNumber);
  
  const nextPlayer = isComplete ? null : nextActivePlayer(updatedPlayers, match.currentPlayer);
  const nextRound = isRoundComplete(updatedPlayers, match.currentRound)
    ? match.currentRound + 1
    : match.currentRound;

  return {
    ...match,
    matchPlayers: updatedPlayers,
    currentPlayer: nextPlayer ? {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    } : null,
    currentRound: nextRound,
    isComplete,
    winner: isComplete ? matchWinner(updatedPlayers, targetNumber) : null,
  };
};

export const editScore = (match: Match, player: MatchPlayer, round: number, score: number): Match => {
  const updatedMatchPlayers = match.matchPlayers.map((matchPlayer) => 
    matchPlayer.player.id === player.player.id
      ? updatePlayerScore(matchPlayer, score, round)
      : matchPlayer
  );

  const updatedMatch = updateMatchState(match, updatedMatchPlayers);

  if (updatedMatch.isComplete) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match.matchPlayers, match.targetNumber ?? 0)) {
    return match;
  }

  const currentPlayer = match.matchPlayers.find(
    (player) => player.player.id === match.currentPlayer?.id
  ) ?? match.matchPlayers[0];

  const updatedMatchPlayers = match.matchPlayers.map((player) =>
    player.player.id === currentPlayer.player.id
      ? updatePlayerScore(player, score)
      : player
  );

  const updatedMatch = updateMatchState(match, updatedMatchPlayers);

  if (updatedMatch.isComplete) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};