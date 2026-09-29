import { describe, expect, it } from 'vitest';
import {
  formatDaysSince,
  formatMonthLabel,
  formatMoodDelta,
  formatSecondsAsDuration,
  formatTemperature,
  maxCount,
} from './statsFormatters';

describe('statsFormatters', () => {
  it('formats seconds as duration', () => {
    expect(formatSecondsAsDuration(0)).toBe('0 s');
    expect(formatSecondsAsDuration(45)).toBe('45 s');
    expect(formatSecondsAsDuration(120)).toBe('2 min');
    expect(formatSecondsAsDuration(135)).toBe('2 min 15 s');
  });

  it('formats temperature and mood delta', () => {
    expect(formatTemperature(1.25)).toBe('1.3°C');
    expect(formatTemperature(null)).toBe('–');
    expect(formatMoodDelta(2.4)).toBe('+2.4');
    expect(formatMoodDelta(-1.2)).toBe('-1.2');
  });

  it('formats days since last dip', () => {
    expect(formatDaysSince(null)).toBe('Ei merkintöjä');
    expect(formatDaysSince(0)).toBe('Tänään');
    expect(formatDaysSince(1)).toBe('Eilen');
    expect(formatDaysSince(4)).toBe('4 päivää sitten');
  });

  it('formats month labels and max counts', () => {
    expect(formatMonthLabel('2026-03')).toMatch(/2026/);
    expect(maxCount([{ count: 2 }, { count: 5 }, { count: 1 }])).toBe(5);
    expect(maxCount([{ visits: 3 }, { visits: 1 }])).toBe(3);
  });
});
