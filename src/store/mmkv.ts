import { createMMKV } from 'react-native-mmkv';
import type { MMKV } from 'react-native-mmkv';

/**
 * Single source of truth MMKV instance for the entire app.
 * All data operations are synchronous - no async/await needed.
 *
 * UI components must NOT import this directly.
 * Access data through custom hooks in src/hooks/ instead.
 */
export const storage: MMKV = createMMKV({
  id: 'timely-storage',
});

/**
 * Storage keys enum to prevent typos and enable autocomplete.
 */
export const StorageKeys = {
  TASKS: 'tasks',
  SETTINGS: 'settings',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
