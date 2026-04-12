import type { Task, Category } from '../types/task';
import { colors } from '../types/theme';

interface ResolvedStyle {
  color: string;
  icon: string | null;
}

/**
 * Resolves the final color and icon for a task.
 * Priority: Task override > Category > Default
 */
export function resolveTaskStyle(task: Task, categories: Category[]): ResolvedStyle {
  let color = colors.accent;
  let icon: string | null = null;

  // Find task's category if it has one
  const category = task.categoryId
    ? categories.find((c) => c.id === task.categoryId)
    : null;

  // Resolve color: task override > category > default accent
  if (task.color) {
    color = task.color;
  } else if (category?.color) {
    color = category.color;
  }

  // Resolve icon: task override > category > null
  if (task.icon) {
    icon = task.icon;
  } else if (category?.icon) {
    icon = category.icon;
  }

  return { color, icon };
}
