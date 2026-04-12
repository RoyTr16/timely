import { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Repeat, Trash2 } from 'lucide-react-native';

import { colors, timing } from '../../types/theme';
import type { Task } from '../../types/task';
import { Checkbox } from '../Checkbox';
import { styles, TASKROW_CONSTANTS } from './styles';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const completionProgress = useSharedValue(task.isCompleted ? 1 : 0);

  useEffect(() => {
    completionProgress.value = withTiming(task.isCompleted ? 1 : 0, {
      duration: timing.normal,
    });
  }, [task.isCompleted, completionProgress]);

  const handleToggle = useCallback(() => {
    onToggle(task.id);
  }, [onToggle, task.id]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [colors.textPrimary, colors.textMuted]
    ),
    textDecorationLine: completionProgress.value > 0.5 ? 'line-through' : 'none',
  }));

  const hasRecurrence = Boolean(task.recurrence);

  const renderRightActions = useCallback(
    () => (
      <Pressable style={styles.deleteAction} onPress={handleDelete}>
        <Trash2 size={TASKROW_CONSTANTS.deleteIconSize} color={colors.textPrimary} />
      </Pressable>
    ),
    [handleDelete]
  );

  return (
    <View style={styles.swipeableContainer}>
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={TASKROW_CONSTANTS.swipeThreshold}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleDelete}
      >
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
      </ReanimatedSwipeable>
    </View>
  );
}
