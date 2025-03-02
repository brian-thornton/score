import { Match, MatchPlayer, Player } from "@/app/lib/types";

export const createNewMatch = (players: Player[]): Match => {
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
    matchType: 'TOURNAMENT',
    maxRounds: 10,
    isComplete: false,
  };
};

const allPlayersCompletedRound = (match: Match): boolean => {
  return match.matchPlayers.every((player) => player.roundScores.length >= match.currentRound);
};

const matchWinner = (match: Match): MatchPlayer | null => {
  const maxScore = match.matchPlayers.reduce((max, player) => Math.max(max, player.score), 0);
  return match.matchPlayers.find((player) => player.score === maxScore) || null;
};

const isGameComplete = (match: Match): boolean => {
  return match.currentRound === match.maxRounds && allPlayersCompletedRound(match) && !isOvertime(match);
};

export const isOvertime = (match: Match): boolean => {
  const maxScore = match.matchPlayers.reduce((max, player) => Math.max(max, player.score), 0);
  const maxScorePlayers = match.matchPlayers.filter((player) => player.score === maxScore);
  return match.currentRound > match.maxRounds && maxScorePlayers.length > 1;
};

export const isRoundComplete = (matchPlayers: MatchPlayer[], currentRound: number): boolean => {
  return matchPlayers.every((player) => player.roundScores.length >= currentRound);
};

export const remainingOvertimePlayers = (match: Match): MatchPlayer[] => {
  const maxScore = match.matchPlayers.reduce((max, player) => Math.max(max, player.score), 0);
  return match.matchPlayers.filter((player) => player.score === maxScore);
};

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match)) {
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

  const nextPlayerIndex = match.matchPlayers.findIndex((player) => player.player.id === match.currentPlayer.id) + 1;
  const nextPlayer = match.matchPlayers[nextPlayerIndex] || match.matchPlayers[0];

  if (isOvertime(match)) {
    const overtimePlayers = remainingOvertimePlayers(match);
    if (overtimePlayers.length === 1) {
      return {
        ...match,
        matchPlayers: updatedMatchPlayers,
        currentPlayer: {
          email: overtimePlayers[0].player.email,
          id: overtimePlayers[0].player.id,
          name: overtimePlayers[0].player.name,
          phone: overtimePlayers[0].player.phone
        },
        currentRound: 1,
        isComplete: true,
        winner: overtimePlayers[0],
        maxRounds: 10,
      };
    }
  }

  let nextRound = match.currentRound;
  if (allPlayersCompletedRound(match)) {
    nextRound += 1;
  }

  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    currentPlayer: {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete: isGameComplete(match),
    winner: isGameComplete(match) ? matchWinner(match) : null,
    maxRounds: isOvertime(match) ? match.maxRounds + 1 : match.maxRounds,
  };

  return updatedMatch;
};