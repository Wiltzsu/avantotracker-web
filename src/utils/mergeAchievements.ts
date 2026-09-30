import { Achievement } from '../services/api';

export const mergeNewAchievements = (...lists: Achievement[][]): Achievement[] => {
  const byId = new Map<string, Achievement>();

  for (const list of lists) {
    for (const achievement of list) {
      byId.set(achievement.id, achievement);
    }
  }

  return [...byId.values()];
};
