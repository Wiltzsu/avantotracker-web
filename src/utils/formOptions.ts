export interface DurationPreset {
  label: string;
  minutes: string;
  seconds: string;
}

export const TEMPERATURE_PRESETS = ['-2', '0', '1', '2', '4'];

export const DURATION_PRESETS: DurationPreset[] = [
  { label: '30 s', minutes: '0', seconds: '30' },
  { label: '1 min', minutes: '1', seconds: '0' },
  { label: '2 min', minutes: '2', seconds: '0' },
  { label: '3 min', minutes: '3', seconds: '0' },
  { label: '5 min', minutes: '5', seconds: '0' },
];

export const SAUNA_DURATION_PRESETS = ['5', '10', '15', '20', '30'];

export const SWEAR_PRESETS = ['0', '1', '2', '3', '5'];

export const FEELING_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const durationPresetKey = (minutes: string, seconds: string): string =>
  `${minutes}:${seconds}`;

export const matchesDurationPreset = (
  minutes: string,
  seconds: string,
  preset: DurationPreset,
): boolean => minutes === preset.minutes && seconds === preset.seconds;

export const isPresetValue = (value: string, presets: string[]): boolean =>
  presets.includes(value);
