/**
 * Time math utilities for proportional layout calculations.
 */

/**
 * Converts "HH:mm" time string to total minutes from midnight.
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts total minutes from midnight to "HH:mm" string.
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculates the end time string given start time and duration.
 */
export function getEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = timeToMinutes(startTime);
  return minutesToTime(startMinutes + durationMinutes);
}

/**
 * Calculates the gap in minutes between end of one task and start of next.
 * Returns 0 if negative (overlapping tasks).
 */
export function calculateGap(endTime: string, nextStartTime: string): number {
  const endMinutes = timeToMinutes(endTime);
  const startMinutes = timeToMinutes(nextStartTime);
  return Math.max(0, startMinutes - endMinutes);
}
