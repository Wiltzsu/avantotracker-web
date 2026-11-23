import React from 'react';
import { MoodTimelinePoint } from '../services/api';
import { buildMoodChartPoints, buildMoodPolyline, moodToY } from '../utils/moodChart';
import { formatDate } from '../utils/formatters';

interface MoodChartProps {
  timeline: MoodTimelinePoint[];
}

const MoodChart: React.FC<MoodChartProps> = ({ timeline }) => {
  const points = buildMoodChartPoints(timeline);

  if (points.length === 0) {
    return <div className="state-banner">Ei fiilidataa valitulla ajanjaksolla.</div>;
  }

  return (
    <div className="mood-chart">
      <div className="mood-chart-plot">
      <div className="mood-chart-axis num" aria-hidden="true">
        <span>10</span>
        <span>5</span>
        <span>1</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Fiilis ennen ja jälkeen, asteikko 1–10">
        {[10, 5, 1].map((value) => (
          <line
            key={value}
            x1="0"
            x2="100"
            y1={moodToY(value)}
            y2={moodToY(value)}
            stroke="var(--color-border)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polyline
          fill="none"
          stroke="var(--color-text-faint)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          points={buildMoodPolyline(points, 'beforeY')}
        />
        <polyline
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          points={buildMoodPolyline(points, 'afterY')}
        />
      </svg>
      </div>
      <div className="mood-chart-legend">
        <span><i className="legend-line before" /> Ennen</span>
        <span><i className="legend-line after" /> Jälkeen</span>
      </div>
      {/* First and last date only: one label per point overflowed with 40+ entries,
          and date keys collided when two dips fell on the same day */}
      <div className="mood-chart-labels num">
        <span>{formatDate(points[0].label)}</span>
        {points.length > 1 && <span>{formatDate(points[points.length - 1].label)}</span>}
      </div>
    </div>
  );
};

export default MoodChart;
