import { TargetSet } from '../types';

const baseUrl = '/api';

export const getTargetSets = (): Promise<TargetSet[]> => {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/target-sets`;
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

export const createTargetSet = async (targetSet: TargetSet): Promise<TargetSet> => {
  return new Promise(async (resolve, reject) => {
    let targetSets = await getTargetSets();

    if (targetSets && targetSets.length > 0) {
      const existingTargetSet = targetSets.find((t) => t.name === targetSet.name);

      if (existingTargetSet) {
        targetSets = targetSets.filter((t) => t.name !== targetSet.name);
      }

      targetSets.push(targetSet);
    }

    targetSets = [targetSet];

    const url = `${baseUrl}/target-sets`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(targetSets),
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
