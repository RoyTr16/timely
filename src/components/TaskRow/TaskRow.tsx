import { useCallback, useEffect } from 'react';
import { Pressable } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Repeat } from 'lucide-react-native';

import { colors, timing } from '../../types/theme';
import type { Task } from '../../types/task';
import { Checkbox } from '../Checkbox';
import { styles, TASKROW_CONSTANTS } from './styles';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskRow({ task, onToggle }: TaskRowProps) {
  const completionProgress = useSharedValue(task.isCompleted ? 1 : 0);

  useEffect(() => {
    completionProgress.value = withTiming(task.isCompleted ? 1 : 0, {
      duration: timing.normal,
    });
  }, [task.isCompleted, completionProgress]);

  const handleToggle = useCallback(() => {
    onToggle(task.id);
  }, [onToggle, task.id]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [colors.textPrimary, colors.textMuted]
    ),
    textDecorationLine: completionProgress.value > 0.5 ? 'line-through' : 'none',
  }));

  const hasRecurrence = Boolean(task.recurrence);

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: TASKROW_CONSTANTS.activeOpacity },
      ]}
    >
      <Checkbox isChecked={task.isCompleted} onToggle={handleToggle} />
      <Animated.View style={styles.content}>
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          {task.title}
        </Animated.Text>
        {hasRecurrence && (
          <Repeat
            size={TASKROW_CONSTANTS.recurrenceIconSize}
            color={colors.textSecondary}
            style={styles.recurrenceIcon}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}
