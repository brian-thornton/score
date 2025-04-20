import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";
import { saveMatchToHistory } from "./api-clients/match-history-helper";
import { initMatch } from "./game-helper";

export const createNewMatch = (players: Player[]): Match => {
  return initMatch(players, MatchType.SINGLES_TOURNAMENT, 10);
};

const isGameComplete = (matchPlayers: MatchPlayer[], match: Match): boolean => {
  return match.currentRound === match.maxRounds
    && isRoundComplete(matchPlayers, match.currentRound)
    && !isOvertime(matchPlayers, match.currentRound, match.maxRounds);
};

export const isOvertime = (matchPlayers: MatchPlayer[], currentRound: number, maxRounds: number): boolean => {
  const activePlayers = matchPlayers.filter((player) => player.isActive);
  const maxScore = activePlayers.reduce((max, player) => Math.max(max, Number(player.score)), 0);
  const maxScorePlayers = activePlayers.filter((player) => player.score === maxScore);

  return isRoundComplete(activePlayers, currentRound) && currentRound >= maxRounds && maxScorePlayers.length > 1;
};

export const remainingOvertimePlayers = (matchPlayers: MatchPlayer[]): MatchPlayer[] => {
  const maxScore = matchPlayers.reduce((max, player) => Math.max(max, Number(player.score)), 0);
  return matchPlayers.filter((player) => player.score === maxScore);
};

const matchWinner = (matchPlayers: MatchPlayer[]): MatchPlayer | null => {
  const maxScore = matchPlayers.reduce((max, player) => Math.max(max, Number(player.score)), 0);
  return matchPlayers.find((player) => player.score === maxScore) || null;
}

export const editScore = (match: Match, player: MatchPlayer, round: number, score: number): Match => {
  const updatedMatchPlayers = match.matchPlayers.map((matchPlayer) => {
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
    isComplete: isGameComplete(updatedMatchPlayers, match),
    winner: isGameComplete(updatedMatchPlayers, match) ? matchWinner(updatedMatchPlayers) : null,
  };

  if (isGameComplete(updatedMatchPlayers, match)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match.matchPlayers, match)) {
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

  if (match.overtime || isOvertime(updatedMatchPlayers, match.currentRound, match.maxRounds)) {
    const overtimePlayers = remainingOvertimePlayers(updatedMatchPlayers);
    nextPlayer = nextActivePlayer(overtimePlayers, match.currentPlayer);

    updatedMatchPlayers.forEach((player) => {
      if (overtimePlayers.find((overtimePlayer) => overtimePlayer.player.id === player.player.id)) {
        player.isActive = true;
      } else {
        player.isActive = false;
      }
    });
  }

  let nextRound = match.currentRound;
  if (isRoundComplete(updatedMatchPlayers, match.currentRound)) {
    nextRound += 1;
  }
  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    currentPlayer: isGameComplete(updatedMatchPlayers, match) ? null : {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete: isGameComplete(updatedMatchPlayers, match),
    winner: isGameComplete(updatedMatchPlayers, match) ? matchWinner(updatedMatchPlayers) : null,
    maxRounds: isOvertime(updatedMatchPlayers, match.currentRound, match.maxRounds) ? match.maxRounds + 1 : match.maxRounds,
  };

  if (isGameComplete(updatedMatchPlayers, match)) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};