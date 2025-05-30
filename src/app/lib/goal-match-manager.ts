import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";
import { saveMatchToHistory } from "./api-clients/match-history-helper";
import { initMatch } from "./game-helper";

export const createNewMatch = (players: Player[]): Match => {
  return initMatch(players, MatchType.GOAL_MATCH, 100);
};

const findCompletedPlayers = (matchPlayers: MatchPlayer[], possibleScores: string[] = []): MatchPlayer[] => {
  return matchPlayers.filter((player) => {
    let hasCompletedAllGoals = true;

    possibleScores.filter(s => s !== 'Miss').forEach((score) => {
      if (!player.roundScores.includes(score)) {
        hasCompletedAllGoals = false;
      }
    });

    if(player.roundScores.length > 0 && hasCompletedAllGoals) {
      return player;
    }
  });
};

const isGameComplete = (matchPlayers: MatchPlayer[], possibleScores: string[] = []): boolean => {
  let hasAtLeastOnePlayerCompletedAllGoals = false;

  matchPlayers.forEach((player) => {
    let hasCompletedAllGoals = true;

    possibleScores.filter(s => s !== 'Miss').forEach((score) => {
      if (!player.roundScores.includes(score)) {
        hasCompletedAllGoals = false;
      }
    });

    if (player.roundScores.length > 0 && hasCompletedAllGoals) {
      hasAtLeastOnePlayerCompletedAllGoals = true;
    }
  });

  return hasAtLeastOnePlayerCompletedAllGoals;
};

export const updateScore = (match: Match, score: string, possibleScores: string[]): Match => {
  let currentPlayer = match.matchPlayers.find((player) => player.player.id === match.currentPlayer?.id);
  if (!currentPlayer) {
    currentPlayer = match.matchPlayers[0];
  }

  const updatedPlayer = {
    ...currentPlayer,
    roundScores: currentPlayer.roundScores.concat(score),
  };

  const updatedMatchPlayers = match.matchPlayers.map((player) => {
    if (player.player.id === match.currentPlayer?.id) {
      return updatedPlayer;
    }
    return player;
  });

  const isTheGameComqplete = isGameComplete(updatedMatchPlayers, possibleScores);
  let nextPlayer = nextActivePlayer(updatedMatchPlayers, match.currentPlayer);

  let nextRound = match.currentRound;
  if (isRoundComplete(updatedMatchPlayers, match.currentRound)) {
    nextRound += 1;
  }
  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    currentPlayer: isTheGameComqplete ? null : {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete: isTheGameComqplete,
    winner: isTheGameComqplete ? findCompletedPlayers(updatedMatchPlayers, possibleScores)[0] : null,
    maxRounds: match.maxRounds,
    possibleScores: possibleScores,
  };

  if (isGameComplete(updatedMatchPlayers, possibleScores)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};