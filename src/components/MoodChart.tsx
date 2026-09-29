import React from 'react';
import { MoodTimelinePoint } from '../services/api';
import { buildMoodChartPoints, buildMoodPolyline } from '../utils/moodChart';

interface MoodChartProps {
  timeline: MoodTimelinePoint[];
}

const MoodChart: React.FC<MoodChartProps> = ({ timeline }) => {
  const points = buildMoodChartPoints(timeline);

  if (points.length === 0) {
    return <div className="stats-state">Ei fiilidataa valitulla ajanjaksolla.</div>;
  }

  return (
    <div className="mood-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Fiilidiagrammi">
        <polyline
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          points={buildMoodPolyline(points, 'beforeY')}
        />
        <polyline
          fill="none"
          stroke="#34d399"
          strokeWidth="1.5"
          points={buildMoodPolyline(points, 'afterY')}
        />
      </svg>
      <div className="mood-chart-legend">
        <span><i className="legend-dot before" /> Ennen</span>
        <span><i className="legend-dot after" /> Jälkeen</span>
      </div>
      <div className="mood-chart-labels">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};

export default MoodChart;
