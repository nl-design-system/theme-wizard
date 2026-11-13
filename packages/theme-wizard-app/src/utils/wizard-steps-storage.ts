import PersistentStorage from '../lib/PersistentStorage';

export const stepsStorage = new PersistentStorage({ prefix: 'wizard-steps' });

export const markStepsComplete = (paths: string[]) => {
  const current: string[] = stepsStorage.getJSON() ?? [];
  const next = [...new Set([...current, ...paths])];
  if (next.length !== current.length) {
    stepsStorage.setJSON(next);
  }
};
