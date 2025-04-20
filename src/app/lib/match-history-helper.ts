import { Match, MatchHistory } from './types';
import { get, post } from './fetch-helper';

const baseUrl = '/api';

export const getMatchHistory = (): Promise<MatchHistory> => get(`${baseUrl}/match-history`);

export const saveMatchToHistory = async (match: Match): Promise<Match> => {
    let matchHistory;
    try {
      matchHistory = await getMatchHistory();
      matchHistory.matchHistory.push(match);
    } catch (error) {
      matchHistory = {matchHistory: [match]};
    }

    const url = `${baseUrl}/match-history`;
    return post(url, matchHistory)
};

export const clearMatchHistory = async (): Promise<void> => {
    const url = `${baseUrl}/match-history`;
    return post(url, {matchHistory: []});
};

