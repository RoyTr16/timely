import { useState, useEffect, useCallback, useMemo } from 'react';

import { storage, StorageKeys } from '../store/mmkv';
import { isTaskActiveOnDate, getFormattedDate, getTodayStr } from '../utils/dateEngine';
import type { Task, RecurrenceRule, EnergyLevel } from '../types/task';

const STORAGE_KEY = `app.${StorageKeys.TASKS}`;
const ARCHIVED_TASKS_KEY = 'app.archived_tasks';

// Cross-instance sync: notify all useTasks instances when data changes
type Listener = () => void;
const listeners = new Set<Listener>();
function notifyAll() {
  listeners.forEach((fn) => fn());
}

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
  recurrenceDays?: number[];
}

interface UseTasksReturn {
  tasks: Task[];
  timelineTasks: Task[];
  inboxTasks: Task[];
  templateTasks: Task[];
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompletion: (taskId: string, dateStr: string) => void;
  deleteTask: (id: string) => void;
  updateBacklogOrder: (reorderedTasks: Task[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function sweepCompletedTasks(): Promise<void> {
  try {
    const storedTasks = await storage.getItem(STORAGE_KEY);
    if (!storedTasks) return;

    const tasks: Task[] = JSON.parse(storedTasks);
    const today = getTodayStr();

    const tasksToKeep: Task[] = [];
    const tasksToArchive: Task[] = [];

    for (const task of tasks) {
      const shouldArchive =
        !task.isTemplate &&
        !task.recurrence &&
        task.completedDates &&
        task.completedDates.length > 0 &&
        task.completedDates.every((d) => d < today);

      if (shouldArchive) {
        tasksToArchive.push(task);
      } else {
        tasksToKeep.push(task);
      }
    }

    if (tasksToArchive.length === 0) return;

    const storedArchive = await storage.getItem(ARCHIVED_TASKS_KEY);
    const archive: Task[] = storedArchive ? JSON.parse(storedArchive) : [];
    await storage.setItem(ARCHIVED_TASKS_KEY, JSON.stringify([...archive, ...tasksToArchive]));
    await storage.setItem(STORAGE_KEY, JSON.stringify(tasksToKeep));
    notifyAll();
  } catch {
    // Sweep errors are non-critical
  }
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

    // Re-load when another instance writes
    const reload = () => { loadTasks(); };
    listeners.add(reload);
    return () => { listeners.delete(reload); };
  }, []);

  // Persist tasks whenever they change
  const persistTasks = useCallback(async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      notifyAll();
    } catch {
      // Handle storage errors silently
    }
  }, []);

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const newTask: Task = {
        id: generateId(),
        title: input.title,
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
        recurrenceDays: input.recurrenceDays,
      };

      persistTasks([newTask, ...tasks]);
    },
    [tasks, persistTasks]
  );

  const toggleTaskCompletion = useCallback(
    (taskId: string, dateStr: string) => {
      const updatedTasks = tasks.map((task) => {
        if (task.id !== taskId) return task;
        const dates = task.completedDates ?? [];
        const updated = dates.includes(dateStr)
          ? dates.filter((d) => d !== dateStr)
          : [...dates, dateStr];
        return { ...task, completedDates: updated };
      });
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

  const inboxTasks = useMemo(
    () => tasks
      .filter((task) => !task.scheduledDate && !task.isTemplate)
      .sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity)),
    [tasks]
  );

  const templateTasks = useMemo(
    () => tasks
      .filter((task) => !task.scheduledDate && task.isTemplate)
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
    inboxTasks,
    templateTasks,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    updateBacklogOrder,
  };
}
