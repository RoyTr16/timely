import type { Task } from '../types/task';

/**
 * Formats a Date object to "YYYY-MM-DD" string.
 */
export function getFormattedDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the day of week (0 = Sunday, 6 = Saturday) for a date string.
 */
function getDayOfWeekFromStr(dateStr: string): number {
  return new Date(dateStr).getDay();
}

/**
 * Checks if a day index (0-6) is a weekday (Mon-Fri).
 */
function isWeekday(dayIndex: number): boolean {
  return dayIndex >= 1 && dayIndex <= 5;
}

/**
 * Determines if a task should appear on a specific date.
 *
 * Rules:
 * - If task.scheduledDate matches targetDateStr, show it
 * - daily recurrence: Always show
 * - weekly recurrence: Show if day of week matches task's scheduledDate (or createdAt)
 * - custom_days: Show if targetDateStr's day matches one of the specified days
 * - No scheduledDate and no recurrence: Backlog task, return false
 */
export function isTaskActiveOnDate(task: Task, targetDateStr: string): boolean {
  if (!task.scheduledDate) return false;

  const [ty, tm, td] = targetDateStr.split('-').map(Number);
  const targetDate = new Date(ty, tm - 1, td);
  targetDate.setHours(0, 0, 0, 0);

  const [sy, sm, sd] = task.scheduledDate.split('-').map(Number);
  const startDate = new Date(sy, sm - 1, sd);
  startDate.setHours(0, 0, 0, 0);

  if (targetDate < startDate) return false;

  if (task.scheduledDate === targetDateStr) return true;

  if (!task.recurrence) return false;

  switch (task.recurrence.type) {
    case 'daily':
      return true;

    case 'weekly': {
      const targetDay = targetDate.getDay();
      if (task.recurrenceDays && task.recurrenceDays.length > 0) {
        return task.recurrenceDays.includes(targetDay);
      }
      return targetDay === startDate.getDay();
    }

    case 'custom_days': {
      const dayMap = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ] as const;
      const targetDayName = dayMap[targetDate.getDay()];
      return task.recurrence.days.includes(targetDayName);
    }

    default:
      return false;
  }
}

/**
 * Legacy: Checks if a task should appear in today's list.
 * @deprecated Use isTaskActiveOnDate instead
 */
export function isTaskDueToday(task: Task): boolean {
  return isTaskActiveOnDate(task, getFormattedDate(new Date()));
}

/**
 * Checks if today is a weekday (Monday-Friday).
 */
export function isTodayWeekday(): boolean {
  return isWeekday(new Date().getDay());
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
