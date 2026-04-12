import type { Task } from '../types/task';

/**
 * Checks if two timestamps fall on the same calendar date.
 */
function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Returns the day of week (0 = Sunday, 6 = Saturday) for a timestamp.
 */
function getDayOfWeek(timestamp: number): number {
  return new Date(timestamp).getDay();
}

/**
 * Checks if a day index (0-6) is a weekday (Mon-Fri).
 */
function isWeekday(dayIndex: number): boolean {
  return dayIndex >= 1 && dayIndex <= 5;
}

/**
 * Determines if a task should appear in today's list.
 *
 * Rules:
 * - daily: Always due today
 * - weekly: Due if today's day matches the day the task was created
 * - custom_days: Due if today matches one of the specified days
 * - no recurrence: Due only if created today
 */
export function isTaskDueToday(task: Task): boolean {
  const now = Date.now();
  const todayDayIndex = getDayOfWeek(now);

  if (!task.recurrence) {
    // One-time task: only show on creation date
    return isSameDay(task.createdAt, now);
  }

  switch (task.recurrence.type) {
    case 'daily':
      return true;

    case 'weekly': {
      // Due on the same day of week as when it was created
      const createdDayIndex = getDayOfWeek(task.createdAt);
      return todayDayIndex === createdDayIndex;
    }

    case 'custom_days': {
      // Map day index to DayOfWeek type
      const dayMap = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ] as const;
      const todayName = dayMap[todayDayIndex];
      return task.recurrence.days.includes(todayName);
    }

    default:
      return false;
  }
}

/**
 * Checks if today is a weekday (Monday-Friday).
 */
export function isTodayWeekday(): boolean {
  return isWeekday(getDayOfWeek(Date.now()));
}

/**
 * Gets a human-readable recurrence label.
 */
export function getRecurrenceLabel(task: Task): string | null {
  if (!task.recurrence) return null;

  switch (task.recurrence.type) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'custom_days':
      return 'Custom';
    default:
      return null;
  }
}
