import { MatchPlayer, Player } from "@/app/lib/types";

export const isRoundComplete = (matchPlayers: MatchPlayer[], currentRound: number): boolean => {
  const activePlayers = matchPlayers.filter((player) => player.isActive);
  return activePlayers.every((player) => player.roundScores.length >= currentRound);
};

export const nextActivePlayer = (matchPlayers: MatchPlayer[], currentPlayer: Player): any => {
  const currentPlayerIndex = matchPlayers.findIndex((player) => player.player.id === currentPlayer.id);
  const nextPlayerIndex = currentPlayerIndex + 1;
  const nextPlayer = matchPlayers[nextPlayerIndex] || matchPlayers[0];
  return nextPlayer;
};
