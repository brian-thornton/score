import { Match } from './types';

const baseUrl = 'http://localhost:3000/api';

export const getMatchHistory = (): Promise<Match[]> => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/match-history`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const saveMatchToHistory = async (match: [Match]): Promise<Match> => {
  return new Promise(async (resolve, reject) => {

    let matchHistory;
    try {
      matchHistory = await getMatchHistory();
      matchHistory.matchHistory.push(match);
    } catch (error) {
      matchHistory = {matchHistory: [match]};
    }

    const url = `${baseUrl}/match-history`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchHistory),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
