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
 * Energy level for task difficulty/effort estimation.
 */
export type EnergyLevel = 1 | 2 | 3;

/**
 * Category for grouping related tasks with shared styling.
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

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
  startTime?: string; // HH:mm format
  durationMinutes?: number;
  energyLevel?: EnergyLevel;
  color?: string; // Explicit color override
  icon?: string; // Explicit icon override
  scheduledDate?: string; // YYYY-MM-DD format
  sortOrder?: number; // For backlog drag-and-drop ordering
  isTemplate?: boolean; // Reusable template vs one-time inbox item
}
