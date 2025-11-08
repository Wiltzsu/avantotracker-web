/**
 * Format temperature color based on water temperature
 */
export const getTemperatureColor = (temp: number | null): string => {
  if (temp === null || temp === undefined) return '#94a3b8'; // Gray for unknown
  if (temp <= 2) return '#3b82f6'; // Blue for very cold
  if (temp <= 5) return '#06b6d4'; // Cyan for cold
  if (temp <= 8) return '#10b981'; // Green for cool
  return '#f59e0b'; // Orange for warmer
}

/**
 * Format ice bath duration
 */
export const formatDuration = (minutes?: number | null, seconds?: number | null): string => {  
  // If minutes and seconds are set
  if (seconds && seconds > 0) {
    return `${minutes} min ${seconds} s`;
  }
  // If minutes are set
  if (minutes) {
    return `${minutes} min`;
  }
  return '0 min';
}

/**
 * Format date
 */
export const formatDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
