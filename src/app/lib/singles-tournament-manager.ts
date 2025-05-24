import { Match, MatchPlayer, MatchType, Player } from "@/app/lib/types";
import { isRoundComplete, nextActivePlayer } from "./match-utils";
import { saveMatchToHistory } from "./api-clients/match-history-helper";
import { initMatch } from "./game-helper";

// Types
type Score = string | number;
type RoundScores = Score[];

// Helper functions for score calculations
const calculateTotalScore = (roundScores: RoundScores): number => {
  return roundScores.reduce((total: number, score: Score) => {
    const numericScore = typeof score === 'string' ? parseFloat(score) : score;
    return total + numericScore;
  }, 0);
};

const getMaxScore = (players: MatchPlayer[]): number => {
  return players.reduce((max, player) => Math.max(max, Number(player.score)), 0);
};

const getPlayersWithMaxScore = (players: MatchPlayer[]): MatchPlayer[] => {
  const maxScore = getMaxScore(players);
  return players.filter((player) => player.score === maxScore);
};

// Match state validation functions
const isGameComplete = (matchPlayers: MatchPlayer[], match: Match): boolean => {
  const isLastRound = match.currentRound === match.maxRounds;
  const isRoundFinished = isRoundComplete(matchPlayers, match.currentRound);
  const isNotInOvertime = !isOvertime(matchPlayers, match.currentRound, match.maxRounds);
  
  return isLastRound && isRoundFinished && isNotInOvertime;
};

export const isOvertime = (matchPlayers: MatchPlayer[], currentRound: number, maxRounds: number): boolean => {
  const activePlayers = matchPlayers.filter((player) => player.isActive);
  const maxScorePlayers = getPlayersWithMaxScore(activePlayers);
  const isRoundFinished = isRoundComplete(activePlayers, currentRound);
  const isAtMaxRounds = currentRound >= maxRounds;
  const hasMultipleLeaders = maxScorePlayers.length > 1;

  return isRoundFinished && isAtMaxRounds && hasMultipleLeaders;
};

export const remainingOvertimePlayers = (matchPlayers: MatchPlayer[]): MatchPlayer[] => {
  return getPlayersWithMaxScore(matchPlayers);
};

const matchWinner = (matchPlayers: MatchPlayer[]): MatchPlayer | null => {
  const maxScorePlayers = getPlayersWithMaxScore(matchPlayers);
  return maxScorePlayers[0] || null;
};

// Score update functions
export const editScore = (match: Match, player: MatchPlayer, round: number, score: number): Match => {
  const updatedMatchPlayers = match.matchPlayers.map((matchPlayer) => {
    if (matchPlayer.player.id === player.player.id) {
      const updatedRoundScores = [...matchPlayer.roundScores];
      updatedRoundScores[round - 1] = score;
      return {
        ...matchPlayer,
        roundScores: updatedRoundScores,
        score: calculateTotalScore(updatedRoundScores),
      };
    }
    return matchPlayer;
  });

  const isComplete = isGameComplete(updatedMatchPlayers, match);
  const updatedMatch = {
    ...match,
    matchPlayers: updatedMatchPlayers,
    isComplete,
    winner: isComplete ? matchWinner(updatedMatchPlayers) : null,
  };

  if (isComplete) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

const updatePlayerScore = (player: MatchPlayer, score: number): MatchPlayer => ({
  ...player,
  score: Number(player.score) + score,
  roundScores: player.roundScores.concat(score),
});

const handleOvertime = (matchPlayers: MatchPlayer[], currentPlayer: Player | null | undefined): {
  updatedPlayers: MatchPlayer[];
  nextPlayer: MatchPlayer;
} => {
  const overtimePlayers = remainingOvertimePlayers(matchPlayers);
  const nextPlayer = nextActivePlayer(overtimePlayers, currentPlayer);

  const updatedPlayers = matchPlayers.map((player) => ({
    ...player,
    isActive: overtimePlayers.some((overtimePlayer) => overtimePlayer.player.id === player.player.id),
  }));

  return { updatedPlayers, nextPlayer };
};

const updateMatchState = (
  match: Match,
  updatedPlayers: MatchPlayer[],
  nextPlayer: MatchPlayer,
  isInOvertime: boolean,
  nextRound: number
): Match => {
  const isComplete = isGameComplete(updatedPlayers, match);
  
  return {
    ...match,
    matchPlayers: updatedPlayers,
    currentPlayer: isComplete ? null : {
      email: nextPlayer.player.email,
      id: nextPlayer.player.id,
      name: nextPlayer.player.name,
      phone: nextPlayer.player.phone
    },
    currentRound: nextRound,
    isComplete,
    winner: isComplete ? matchWinner(updatedPlayers) : null,
    maxRounds: isInOvertime ? match.maxRounds + 1 : match.maxRounds,
  };
};

export const updateScore = (match: Match, score: number): Match => {
  if (isGameComplete(match.matchPlayers, match)) {
    return match;
  }

  const currentPlayer = match.matchPlayers.find((player) => player.player.id === match.currentPlayer?.id) 
    || match.matchPlayers[0];

  const updatedPlayer = updatePlayerScore(currentPlayer, score);
  const updatedMatchPlayers = match.matchPlayers.map((player) => 
    player.player.id === match.currentPlayer?.id ? updatedPlayer : player
  );

  const isInOvertime = match.overtime || isOvertime(updatedMatchPlayers, match.currentRound, match.maxRounds);
  const { updatedPlayers, nextPlayer } = isInOvertime 
    ? handleOvertime(updatedMatchPlayers, match.currentPlayer)
    : { 
        updatedPlayers: updatedMatchPlayers, 
        nextPlayer: nextActivePlayer(updatedMatchPlayers, match.currentPlayer) 
      };

  const nextRound = isRoundComplete(updatedPlayers, match.currentRound) 
    ? match.currentRound + 1 
    : match.currentRound;

  const updatedMatch = updateMatchState(match, updatedPlayers, nextPlayer, isInOvertime, nextRound);

  if (updatedMatch.isComplete) {
    saveMatchToHistory(updatedMatch);
  }

  return updatedMatch;
};

export const createNewMatch = (players: Player[]): Match => {
  return initMatch(players, MatchType.SINGLES_TOURNAMENT, 10);
};