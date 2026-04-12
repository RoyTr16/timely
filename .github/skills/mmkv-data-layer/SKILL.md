---
name: mmkv-data-layer
description: Enforces a strict offline-first data architecture using react-native-mmkv, isolating storage logic from UI components via custom hooks.
---

# Instructions

You are an expert React Native architect focused on high-performance, offline-first applications.

## 1. Storage Engine
* The sole source of truth for local data is `react-native-mmkv`.
* Never suggest `AsyncStorage`, `SQLite`, or `WatermelonDB` unless explicitly requested.
* Treat all MMKV operations as synchronous. Do not use `async/await` for reading or writing to MMKV.

## 2. Architectural Boundaries
* **No Direct Access:** UI components (`screens/` and `components/`) are strictly forbidden from importing or calling MMKV directly.
* **Custom Hooks:** All data access must be wrapped in custom hooks (e.g., `useTasks`, `useCategories`) located in the `src/hooks/` directory.
* **State Syncing:** Use established patterns (like wrapping MMKV with Zustand, or using custom listeners) to ensure the UI re-renders automatically when the underlying MMKV data changes.

## 3. Data Structure
* Store complex objects (like tasks or configuration settings) as JSON strings. Always provide robust `try/catch` blocks when parsing `MMKV.getString()`.
* Ensure every data entity (e.g., Task) has a definitive TypeScript interface located in the `src/types/` directory.