import { describe, expect, it } from 'vitest';
import { buildMoodChartPoints, buildMoodPolyline, moodToY } from './moodChart';

describe('moodChart helpers', () => {
  it('maps mood values to chart coordinates', () => {
    expect(moodToY(1)).toBe(100);
    expect(moodToY(10)).toBe(0);
  });

  it('builds chart points and polylines', () => {
    const points = buildMoodChartPoints([
      {
        avanto_id: 1,
        date: '2026-01-01',
        feeling_before: 3,
        feeling_after: 8,
        mood_delta: 5,
      },
      {
        avanto_id: 2,
        date: '2026-02-01',
        feeling_before: 4,
        feeling_after: 7,
        mood_delta: 3,
      },
    ]);

    expect(points).toHaveLength(2);
    expect(buildMoodPolyline(points, 'beforeY')).toContain('0,');
    expect(buildMoodPolyline(points, 'afterY')).toContain('100,');
  });
});
