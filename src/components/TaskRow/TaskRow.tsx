import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, View, Text } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Repeat, Trash2, Zap } from 'lucide-react-native';

import { colors, timing } from '../../types/theme';
import type { Task } from '../../types/task';
import { Checkbox } from '../Checkbox';
import { styles, TASKROW_CONSTANTS, getEnergyColor } from './styles';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (task: Task) => void;
}

export function TaskRow({ task, onToggle, onDelete, onPress }: TaskRowProps) {
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

  const handlePress = useCallback(() => {
    onPress(task);
  }, [onPress, task]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      completionProgress.value,
      [0, 1],
      [colors.textPrimary, colors.textMuted]
    ),
    textDecorationLine: completionProgress.value > 0.5 ? 'line-through' : 'none',
  }));

  const hasRecurrence = Boolean(task.recurrence);
  const hasTimeInfo = Boolean(task.startTime || task.durationMinutes);

  const timeInfoText = useMemo(() => {
    if (!hasTimeInfo) return null;
    const parts: string[] = [];
    if (task.startTime) parts.push(task.startTime);
    if (task.durationMinutes) {
      const mins = task.durationMinutes;
      parts.push(mins >= 60 ? `${mins / 60}h` : `${mins}m`);
    }
    return parts.join(' • ');
  }, [task.startTime, task.durationMinutes, hasTimeInfo]);

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
      <View style={styles.timelineLine} />
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={TASKROW_CONSTANTS.swipeThreshold}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleDelete}
      >
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.container,
            pressed && { opacity: TASKROW_CONSTANTS.activeOpacity },
          ]}
        >
          <View style={styles.timelineContainer}>
            <Checkbox isChecked={task.isCompleted} onToggle={handleToggle} />
          </View>
          <View style={styles.contentWrapper}>
            <Animated.View style={styles.content}>
              <View style={styles.titleContainer}>
                <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                  {task.title}
                </Animated.Text>
                {timeInfoText && (
                  <Text style={styles.timeInfo}>{timeInfoText}</Text>
                )}
              </View>
              {hasRecurrence && (
                <Repeat
                  size={TASKROW_CONSTANTS.recurrenceIconSize}
                  color={colors.textSecondary}
                  style={styles.recurrenceIcon}
                />
              )}
            </Animated.View>
          </View>
          {task.energyLevel && (
            <View style={styles.energyIndicator}>
              <Zap
                size={TASKROW_CONSTANTS.energyIconSize}
                color={getEnergyColor(task.energyLevel)}
                fill={getEnergyColor(task.energyLevel)}
              />
            </View>
          )}
        </Pressable>
      </ReanimatedSwipeable>
    </View>
  );
}
