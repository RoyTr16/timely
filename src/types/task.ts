/**
 * Days of the week for custom recurrence patterns.
 */
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Recurrence configuration for repeating tasks.
 */
export type RecurrenceRule =
  | { type: 'daily' }
  | { type: 'weekly' }
  | { type: 'custom_days'; days: DayOfWeek[] };

/**
 * Core Task entity stored in MMKV.
 */
export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
  categoryId?: string;
  recurrence?: RecurrenceRule;
}
