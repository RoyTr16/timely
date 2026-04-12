import { useState, useEffect, useCallback } from 'react';

import { storage, StorageKeys } from '../store/mmkv';
import type { Category } from '../types/task';

const STORAGE_KEY = `app.${StorageKeys.CATEGORIES}`;

interface UseCategoriesReturn {
  categories: Category[];
  addCategory: (input: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from storage on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (stored) {
          setCategories(JSON.parse(stored));
        }
      } catch {
        // Ignore parse errors, start with empty array
      }
    };
    loadCategories();
  }, []);

  // Persist categories whenever they change
  const persistCategories = useCallback(async (newCategories: Category[]) => {
    setCategories(newCategories);
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
    } catch {
      // Handle storage errors silently
    }
  }, []);

  const addCategory = useCallback(
    (input: Omit<Category, 'id'>) => {
      const newCategory: Category = {
        id: generateId(),
        name: input.name,
        color: input.color,
        icon: input.icon,
      };

      persistCategories([...categories, newCategory]);
    },
    [categories, persistCategories]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      const updatedCategories = categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      );
      persistCategories(updatedCategories);
    },
    [categories, persistCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const filteredCategories = categories.filter((category) => category.id !== id);
      persistCategories(filteredCategories);
    },
    [categories, persistCategories]
  );

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
