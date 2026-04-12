import { useState, useEffect, useCallback, useMemo } from 'react';

import { storage, StorageKeys } from '../store/mmkv';
import { isTaskActiveOnDate, getFormattedDate } from '../utils/dateEngine';
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
  scheduledDate?: string;
  isTemplate?: boolean;
}

interface UseTasksReturn {
  tasks: Task[];
  timelineTasks: Task[];
  backlogTasks: Task[];
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateBacklogOrder: (reorderedTasks: Task[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useTasks(targetDateStr?: string): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const dateStr = targetDateStr ?? getFormattedDate(new Date());

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
        scheduledDate: input.scheduledDate,
        isTemplate: input.isTemplate,
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

  // Derive tasks active on targeted date, sorted chronologically
  const timelineTasks = useMemo(() => {
    const filtered = tasks.filter((task) => isTaskActiveOnDate(task, dateStr));
    return filtered.sort((a, b) => {
      // Tasks without startTime ("All Day") come first
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      // Both have startTime, sort chronologically
      return a.startTime.localeCompare(b.startTime);
    });
  }, [tasks, dateStr]);

  // Derive tasks without scheduledDate (backlog), sorted by sortOrder
  const backlogTasks = useMemo(
    () => tasks
      .filter((task) => !task.scheduledDate)
      .sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)),
    [tasks]
  );

  // Update sortOrder for reordered backlog tasks
  const updateBacklogOrder = useCallback(
    (reorderedTasks: Task[]) => {
      const updatedBacklog = reorderedTasks.map((task, index) => ({
        ...task,
        sortOrder: index,
      }));

      // Merge updated backlog with non-backlog tasks
      const nonBacklogTasks = tasks.filter((task) => task.scheduledDate);
      persistTasks([...updatedBacklog, ...nonBacklogTasks]);
    },
    [tasks, persistTasks]
  );

  return {
    tasks,
    timelineTasks,
    backlogTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    updateBacklogOrder,
  };
}
