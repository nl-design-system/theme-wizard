import PersistentStorage from '../lib/PersistentStorage';

export const stepsStorage = new PersistentStorage({ prefix: 'wizard-steps' });

export const markStepComplete = (path: string) => {
  const current: string[] = stepsStorage.getJSON() ?? [];
  if (!current.includes(path)) {
    stepsStorage.setJSON([...current, path]);
  }
};
