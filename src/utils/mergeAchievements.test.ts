import { describe, expect, it } from 'vitest';
import { mergeNewAchievements } from './mergeAchievements';

describe('mergeNewAchievements', () => {
  it('merges lists and deduplicates by id', () => {
    const merged = mergeNewAchievements(
      [{ id: 'first_dip', title: 'A', description: 'a', unlocked: true }],
      [
        { id: 'first_dip', title: 'A', description: 'a', unlocked: true },
        { id: 'regular', title: 'B', description: 'b', unlocked: true },
      ],
    );

    expect(merged).toHaveLength(2);
    expect(merged.map((item) => item.id)).toEqual(['first_dip', 'regular']);
  });
});
