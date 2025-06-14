const STORAGE_KEY = 'target-sets';

interface TargetSet {
  id: string;
  name: string;
  targets: string[];
}

export const saveTargetSet = (targetSet: TargetSet) => {
  try {
    const targetSets = getTargetSets();
    const existingIndex = targetSets.findIndex(set => set.id === targetSet.id);
    
    if (existingIndex >= 0) {
      targetSets[existingIndex] = targetSet;
    } else {
      targetSets.push(targetSet);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(targetSets));
    return targetSet;
  } catch (error) {
    console.error('Error saving target set:', error);
    throw error;
  }
};

export const getTargetSets = (): TargetSet[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading target sets:', error);
    return [];
  }
};

export const deleteTargetSet = (id: string) => {
  try {
    const targetSets = getTargetSets();
    const filteredSets = targetSets.filter(set => set.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSets));
  } catch (error) {
    console.error('Error deleting target set:', error);
    throw error;
  }
};

export const removeBlankTargetSets = () => {
  try {
    const targetSets = getTargetSets();
    const validSets = targetSets.filter(set => set.name && set.targets && set.targets.length > 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validSets));
    return validSets;
  } catch (error) {
    console.error('Error removing blank target sets:', error);
    throw error;
  }
};
