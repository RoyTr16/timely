import { useCallback, useEffect, useMemo } from 'react';
import { Pressable, View, Text } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Bookmark, CalendarPlus, CheckCircle, Circle, GripVertical, Repeat, Trash2, Zap } from 'lucide-react-native';

import { colors, timing } from '../../types/theme';
import type { Task } from '../../types/task';
import { useCategories } from '../../hooks';
import { resolveTaskStyle, ICON_REGISTRY, calculateGap } from '../../utils';
import { GlassCard } from '../GlassCard';
import { styles, TASKROW_CONSTANTS, getEnergyColor } from './styles';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string, dateStr: string) => void;
  onDelete: (id: string) => void;
  onPress: (task: Task) => void;
  onLongPress?: () => void;
  onQuickSchedule?: () => void;
  isBacklogContext?: boolean;
  isProportional?: boolean;
  previousTaskEndTime?: string;
  currentRenderDate?: string;
}

// Layout constants for proportional rendering
const PIXELS_PER_MINUTE = 1.2;
const MIN_HEIGHT = 64; // Floor for proportional scaling; content can grow beyond
const MAX_GAP_PIXELS = 120;

export function TaskRow({ task, onToggle, onDelete, onPress, onLongPress, onQuickSchedule, isBacklogContext = false, isProportional = false, previousTaskEndTime, currentRenderDate }: TaskRowProps) {
  const { categories } = useCategories();
  const { color: resolvedColor, icon: resolvedIcon } = resolveTaskStyle(task, categories);
  const IconComponent = resolvedIcon ? ICON_REGISTRY[resolvedIcon] : null;
  const isDone = (currentRenderDate && task.completedDates?.includes(currentRenderDate)) || false;

  // Calculate proportional dimensions
  const proportionalStyle = useMemo(() => {
    if (!isProportional) {
      // Non-proportional: just add default bottom margin
      return { marginBottom: 8 };
    }

    const style: { minHeight?: number; marginTop?: number; marginBottom: number } = {
      marginBottom: 8, // Base spacing between scheduled tasks
    };

    // Dynamic minHeight based on duration (minHeight allows content to grow beyond if needed)
    const durationMinutes = task.durationMinutes ?? 30; // Default 30 min if no duration
    style.minHeight = Math.max(MIN_HEIGHT, durationMinutes * PIXELS_PER_MINUTE);

    // Dynamic gap based on time between tasks
    if (previousTaskEndTime && task.startTime) {
      const gapMinutes = calculateGap(previousTaskEndTime, task.startTime);
      if (gapMinutes > 0) {
        style.marginTop = Math.min(gapMinutes * PIXELS_PER_MINUTE, MAX_GAP_PIXELS);
      }
    }

    return style;
  }, [isProportional, task.durationMinutes, task.startTime, previousTaskEndTime]);

  // Calculate card height for explicit passing to GlassCard
  const cardMinHeight = proportionalStyle.minHeight;

  const completionProgress = useSharedValue(isDone ? 1 : 0);

  useEffect(() => {
    completionProgress.value = withTiming(isDone ? 1 : 0, {
      duration: timing.normal,
    });
  }, [isDone, completionProgress]);

  const handleToggle = useCallback(() => {
    if (currentRenderDate) {
      onToggle(task.id, currentRenderDate);
    }
  }, [onToggle, task.id, currentRenderDate]);

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
    <View style={[styles.swipeableContainer, proportionalStyle]}>
      {proportionalStyle.marginTop && proportionalStyle.marginTop > 0 && (
        <View
          style={[
            styles.gapConnector,
            {
              height: proportionalStyle.marginTop + proportionalStyle.marginBottom,
              top: -(proportionalStyle.marginTop + proportionalStyle.marginBottom),
            },
          ]}
        />
      )}
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={TASKROW_CONSTANTS.swipeThreshold}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleDelete}
      >
        <GlassCard
          tintColor={resolvedColor}
          style={[
            cardMinHeight ? { minHeight: cardMinHeight } : undefined,
            isDone && styles.cardDone,
          ]}
        >
          <Pressable
            onPress={handlePress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
              styles.container,
              pressed && { opacity: TASKROW_CONSTANTS.activeOpacity },
            ]}
          >
          <View style={styles.timelineContainer}>
            {isBacklogContext ? (
              <GripVertical size={TASKROW_CONSTANTS.taskIconSize} color={colors.textMuted} />
            ) : (
              <Pressable onPress={handleToggle} hitSlop={8}>
                {isDone ? (
                  <CheckCircle size={24} color={colors.accent} />
                ) : (
                  <Circle size={24} color={resolvedColor} />
                )}
              </Pressable>
            )}
          </View>
          <View style={styles.contentWrapper}>
            <Animated.View style={styles.content}>
              {IconComponent && (
                <IconComponent
                  size={TASKROW_CONSTANTS.taskIconSize}
                  color={resolvedColor}
                  style={styles.taskIcon}
                />
              )}
              <View style={styles.titleContainer}>
                <Animated.Text style={[styles.title, titleAnimatedStyle, isDone && styles.titleDone]}>
                  {task.title}
                </Animated.Text>
                {timeInfoText && (
                  <Text style={[styles.timeInfo, isDone && styles.timeInfoDone]}>{timeInfoText}</Text>
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
          {isBacklogContext && task.isTemplate && (
            <View style={styles.templateIndicator}>
              <Bookmark
                size={TASKROW_CONSTANTS.energyIconSize}
                color={colors.accent}
                fill={colors.accent}
              />
            </View>
          )}
          {isBacklogContext && onQuickSchedule && (
            <Pressable style={styles.quickScheduleButton} onPress={onQuickSchedule} hitSlop={8}>
              <CalendarPlus size={TASKROW_CONSTANTS.taskIconSize} color={colors.accent} />
            </Pressable>
          )}
        </Pressable>
        </GlassCard>
      </ReanimatedSwipeable>
    </View>
  );
}
