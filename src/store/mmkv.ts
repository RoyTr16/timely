import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage abstraction layer.
 * Uses AsyncStorage for Expo Go compatibility.
 * Can be swapped to MMKV when using development builds.
 *
 * UI components must NOT import this directly.
 * Access data through custom hooks in src/hooks/ instead.
 */
export const storage = AsyncStorage;

/**
 * Storage keys enum to prevent typos and enable autocomplete.
 */
export const StorageKeys = {
  TASKS: 'tasks',
  SETTINGS: 'settings',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
