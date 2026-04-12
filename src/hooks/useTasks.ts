import { useState, useEffect, useCallback, useMemo } from 'react';

import { storage, StorageKeys } from '../store/mmkv';
import { isTaskDueToday } from '../utils/dateEngine';
import type { Task, RecurrenceRule, EnergyLevel } from '../types/task';

const STORAGE_KEY = `app.${StorageKeys.TASKS}`;

interface NewTaskInput {
  title: string;
  categoryId?: string;
  recurrence?: RecurrenceRule;
  startTime?: string;
  durationMinutes?: number;
  energyLevel?: EnergyLevel;
  color?: string;
  icon?: string;
}

interface UseTasksReturn {
  tasks: Task[];
  todayTasks: Task[];
  backlogTasks: Task[];
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from storage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored));
        }
      } catch {
        // Ignore parse errors, start with empty array
      }
    };
    loadTasks();
  }, []);

  // Persist tasks whenever they change
  const persistTasks = useCallback(async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch {
      // Handle storage errors silently
    }
  }, []);

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const newTask: Task = {
        id: generateId(),
        title: input.title,
        isCompleted: false,
        createdAt: Date.now(),
        categoryId: input.categoryId,
        recurrence: input.recurrence,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        energyLevel: input.energyLevel,
        color: input.color,
        icon: input.icon,
      };

      persistTasks([newTask, ...tasks]);
    },
    [tasks, persistTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      );
      persistTasks(updatedTasks);
    },
    [tasks, persistTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const filteredTasks = tasks.filter((task) => task.id !== id);
      persistTasks(filteredTasks);
    },
    [tasks, persistTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      persistTasks(updatedTasks);
    },
    [tasks, persistTasks]
  );

  // Derive tasks that are due today, sorted chronologically
  const todayTasks = useMemo(() => {
    const filtered = tasks.filter(isTaskDueToday);
    return filtered.sort((a, b) => {
      // Tasks without startTime ("All Day") come first
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      // Both have startTime, sort chronologically
      return a.startTime.localeCompare(b.startTime);
    });
  }, [tasks]);

  // Derive tasks NOT due today (backlog)
  const backlogTasks = useMemo(
    () => tasks.filter((task) => !isTaskDueToday(task)),
    [tasks]
  );

  return {
    tasks,
    todayTasks,
    backlogTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
