import { describe, expect, it } from 'vitest';
import { getAchievementIcon } from './achievementIcons';

describe('achievementIcons', () => {
  it('returns a mapped icon for known achievements', () => {
    expect(getAchievementIcon('first_dip')).toBe('👣');
    expect(getAchievementIcon('cold_heart')).toBe('💙');
  });

  it('falls back for unknown achievements', () => {
    expect(getAchievementIcon('unknown_badge')).toBe('🏅');
  });
});
