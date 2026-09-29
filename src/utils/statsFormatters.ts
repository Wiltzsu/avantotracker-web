export const formatSecondsAsDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} s`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} s`;
};

export const formatTemperature = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '–';
  }

  return `${value.toFixed(1)}°C`;
};

export const formatMoodDelta = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '–';
  }

  const prefix = value > 0 ? '+' : '';

  return `${prefix}${value.toFixed(1)}`;
};

export const formatDaysSince = (days: number | null | undefined): string => {
  if (days === null || days === undefined) {
    return 'Ei merkintöjä';
  }

  if (days === 0) {
    return 'Tänään';
  }

  if (days === 1) {
    return 'Eilen';
  }

  return `${days} päivää sitten`;
};

export const formatMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString('fi-FI', {
    month: 'short',
    year: 'numeric',
  });
};

export type StatsRange = 'all' | 'month' | '6months' | 'year';

export const STATS_RANGE_OPTIONS: { value: StatsRange; label: string }[] = [
  { value: 'all', label: 'Kaikki' },
  { value: 'month', label: '30 pv' },
  { value: '6months', label: '6 kk' },
  { value: 'year', label: '12 kk' },
];

export const maxCount = (items: { count?: number; visits?: number }[]): number => {
  return items.reduce((max, item) => {
    const value = item.count ?? item.visits ?? 0;
    return Math.max(max, value);
  }, 0);
};
