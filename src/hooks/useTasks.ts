import { useState, useEffect, useCallback, useMemo } from 'react';

import { storage, StorageKeys } from '../store/mmkv';
import { isTaskDueToday } from '../utils/dateEngine';
import type { Task, RecurrenceRule } from '../types/task';

const STORAGE_KEY = `app.${StorageKeys.TASKS}`;

interface NewTaskInput {
  title: string;
  categoryId?: string;
  recurrence?: RecurrenceRule;
}

interface UseTasksReturn {
  tasks: Task[];
  todayTasks: Task[];
  addTask: (input: NewTaskInput) => void;
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

  // Derive tasks that are due today
  const todayTasks = useMemo(
    () => tasks.filter(isTaskDueToday),
    [tasks]
  );

  return {
    tasks,
    todayTasks,
    addTask,
    toggleTask,
    deleteTask,
  };
}
