import { Match, MatchPlayer, MatchType } from './types';
import { v4 as uuidv4 } from 'uuid';

const WINNING_SCORE = 21;

export const createNewMatch = (players: MatchPlayer[]): Match => {
  const initialMatchPlayers: MatchPlayer[] = players.map(p => ({
    ...p,
    score: 0,
    roundScores: [],
    isActive: false,
  }));

  // Randomly select the first player to be active
  const firstPlayerIndex = Math.floor(Math.random() * initialMatchPlayers.length);
  initialMatchPlayers[firstPlayerIndex].isActive = true;

  return {
    id: uuidv4(),
    matchPlayers: initialMatchPlayers,
    currentPlayer: initialMatchPlayers[firstPlayerIndex].player,
    currentRound: 1,
    matchType: MatchType.CORNHOLE,
    maxRounds: Infinity, // Cornhole has no fixed max rounds
    isComplete: false,
    winner: undefined,
  };
};

export const updateScore = (currentMatch: Match, scoredPlayerId: string, score: number): Match => {
  const updatedMatchPlayers = currentMatch.matchPlayers.map(p => ({ ...p }));
  let nextPlayerIndex = 0;

  const playerIndex = updatedMatchPlayers.findIndex(p => p.player.id === scoredPlayerId);
  if (playerIndex === -1) {
    return currentMatch; // Should not happen
  }

  const currentPlayer = updatedMatchPlayers[playerIndex];
  const otherPlayer = updatedMatchPlayers[(playerIndex + 1) % updatedMatchPlayers.length];

  // Initialize round score if not present
  if (!currentPlayer.roundScores[currentMatch.currentRound - 1]) {
    currentPlayer.roundScores[currentMatch.currentRound - 1] = 0;
  }
  if (!otherPlayer.roundScores[currentMatch.currentRound - 1]) {
    otherPlayer.roundScores[currentMatch.currentRound - 1] = 0;
  }

  // Apply cancel scoring: only one player scores per round
  if (currentPlayer.roundScores[currentMatch.currentRound - 1] === 0 && otherPlayer.roundScores[currentMatch.currentRound - 1] === 0) {
    // This is the first score in the round
    currentPlayer.roundScores[currentMatch.currentRound - 1] = score;
  } else {
    // A score has already been entered in this round (by the other player)
    currentPlayer.roundScores[currentMatch.currentRound - 1] = score;
    // The other player's score for this round should be 0
    otherPlayer.roundScores[currentMatch.currentRound - 1] = 0;
  }

  // Update total scores
  currentPlayer.score = currentPlayer.roundScores.reduce((sum, s) => Number(sum) + Number(s), 0);
  otherPlayer.score = otherPlayer.roundScores.reduce((sum, s) => Number(sum) + Number(s), 0);

  // Determine if the round is complete and advance to next round
  const isRoundComplete = 
    currentPlayer.roundScores[currentMatch.currentRound - 1] !== undefined &&
    otherPlayer.roundScores[currentMatch.currentRound - 1] !== undefined;

  let newCurrentRound = currentMatch.currentRound;
  let newCurrentPlayer = currentMatch.currentPlayer;

  if (isRoundComplete) {
    newCurrentRound = currentMatch.currentRound + 1;
    // The next active player is the one who scored higher in the previous round, or current winner, or random
    if (Number(currentPlayer.score) >= WINNING_SCORE && Number(currentPlayer.score) > Number(otherPlayer.score)) {
      newCurrentPlayer = currentPlayer.player;
    } else if (Number(otherPlayer.score) >= WINNING_SCORE && Number(otherPlayer.score) > Number(currentPlayer.score)) {
      newCurrentPlayer = otherPlayer.player;
    } else {
      // If scores are tied or no clear winner yet, the next player is random
      nextPlayerIndex = Math.floor(Math.random() * updatedMatchPlayers.length);
      newCurrentPlayer = updatedMatchPlayers[nextPlayerIndex].player;
    }
  } else {
    // If round is not complete, switch to the other player
    nextPlayerIndex = (playerIndex + 1) % updatedMatchPlayers.length;
    newCurrentPlayer = updatedMatchPlayers[nextPlayerIndex].player;
  }

  // Check for winner
  let winner: MatchPlayer | undefined = undefined;
  let isComplete = false;

  if (Number(currentPlayer.score) >= WINNING_SCORE && Number(currentPlayer.score) > Number(otherPlayer.score)) {
    winner = currentPlayer;
    isComplete = true;
  } else if (Number(otherPlayer.score) >= WINNING_SCORE && Number(otherPlayer.score) > Number(currentPlayer.score)) {
    winner = otherPlayer;
    isComplete = true;
  }

  return {
    ...currentMatch,
    matchPlayers: updatedMatchPlayers,
    currentRound: newCurrentRound,
    currentPlayer: newCurrentPlayer,
    isComplete: isComplete,
    winner: winner,
  };
}; 