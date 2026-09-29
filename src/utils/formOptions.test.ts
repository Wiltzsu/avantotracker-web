import { describe, expect, it } from 'vitest';
import {
  DURATION_PRESETS,
  isPresetValue,
  matchesDurationPreset,
} from './formOptions';

describe('formOptions', () => {
  it('matches duration presets by minutes and seconds', () => {
    const preset = DURATION_PRESETS[1];
    expect(matchesDurationPreset('1', '0', preset)).toBe(true);
    expect(matchesDurationPreset('1', '30', preset)).toBe(false);
  });

  it('checks preset membership', () => {
    expect(isPresetValue('2', ['0', '1', '2'])).toBe(true);
    expect(isPresetValue('7', ['0', '1', '2'])).toBe(false);
  });
});
