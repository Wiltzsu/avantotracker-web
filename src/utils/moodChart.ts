import { MoodTimelinePoint } from '../services/api';

export interface MoodChartPoint {
  x: number;
  beforeY: number;
  afterY: number;
  label: string;
}

const CHART_HEIGHT = 100;
const MIN_MOOD = 1;
const MAX_MOOD = 10;

export const buildMoodChartPoints = (timeline: MoodTimelinePoint[]): MoodChartPoint[] => {
  if (timeline.length === 0) {
    return [];
  }

  const step = timeline.length === 1 ? 0 : 100 / (timeline.length - 1);

  return timeline.map((point, index) => ({
    x: timeline.length === 1 ? 50 : index * step,
    beforeY: moodToY(point.feeling_before),
    afterY: moodToY(point.feeling_after),
    label: point.date.slice(0, 10),
  }));
};

export const moodToY = (value: number): number => {
  const normalized = (value - MIN_MOOD) / (MAX_MOOD - MIN_MOOD);
  return CHART_HEIGHT - normalized * CHART_HEIGHT;
};

export const buildMoodPolyline = (points: MoodChartPoint[], key: 'beforeY' | 'afterY'): string => {
  return points.map((point) => `${point.x},${point[key]}`).join(' ');
};
