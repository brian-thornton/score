export type Player = {
  id: string,
  name: string,
  email: string,
  phone: string,
};

export type MatchPlayer = {
  player: Player,
  score: number,
  roundScores: (string | number)[],
  isActive: boolean,
};

export type Team = {
  id?: string,
  name?: string,
  players?: Player[],
};

export enum MatchType {
  SINGLES_TOURNAMENT = 'SINGLES_TOURNAMENT',
  TARGET_NUMBER = 'TARGET_NUMBER',
  GOAL_MATCH = 'GOAL_MATCH',
};

export type Match = {
  id: string,
  matchPlayers: MatchPlayer[], 
  currentPlayer: Player,
  currentRound: number,
  matchType: string,
  maxRounds: number,
  isComplete: boolean,
  winner?: MatchPlayer | null | undefined,
  overtime?: boolean,
  targetNumber?: number,
  possibleScores?: string[],
};

export type MatchHistory = {
  matchHistory: Match[]
}

export type TargetSet = {
  name: string,
  targets?: string[],
}

export default Player;
