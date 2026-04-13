import { useCallback, useRef, useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Animated, { LinearTransition, Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow, TaskComposer, DaySelector } from '../../components';
import { colors } from '../../types/theme';
import { getFormattedDate, getEndTime } from '../../utils';
import type { Task } from '../../types/task';
import { styles } from '../../styles/tabs';

export default function TimelineScreen() {
  const [activeDate, setActiveDate] = useState(() => getFormattedDate(new Date()));
  const { timelineTasks, addTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks(activeDate);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Split tasks into flexible (no startTime) and scheduled (with startTime)
  const { flexibleTasks, scheduledTasks } = useMemo(() => {
    const flexible: Task[] = [];
    const scheduled: Task[] = [];
    for (const task of timelineTasks) {
      if (task.startTime) {
        scheduled.push(task);
      } else {
        flexible.push(task);
      }
    }
    // Scheduled tasks are already sorted by useTasks
    return { flexibleTasks: flexible, scheduledTasks: scheduled };
  }, [timelineTasks]);

  const handleOpenComposer = useCallback(() => {
    setSelectedTask(null);
    bottomSheetRef.current?.present();
  }, []);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    bottomSheetRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      // Calculate previous task's end time for proportional gaps
      const prevTask = index > 0 ? scheduledTasks[index - 1] : null;
      const previousTaskEndTime = prevTask?.startTime && prevTask?.durationMinutes
        ? getEndTime(prevTask.startTime, prevTask.durationMinutes)
        : undefined;

      return (
        <TaskRow
          task={item}
          onToggle={toggleTaskCompletion}
          onDelete={deleteTask}
          onPress={handleTaskPress}
          isProportional
          previousTaskEndTime={previousTaskEndTime}
          currentRenderDate={activeDate}
        />
      );
    },
    [scheduledTasks, toggleTaskCompletion, deleteTask, handleTaskPress, activeDate]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => {
      if (flexibleTasks.length > 0) return null;
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet. Tap + to add one!</Text>
        </View>
      );
    },
    [flexibleTasks.length]
  );

  const ListHeaderComponent = useCallback(
    () => {
      if (flexibleTasks.length === 0) return null;
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>All-Day / Flexible</Text>
          {flexibleTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              onPress={handleTaskPress}
              currentRenderDate={activeDate}
            />
          ))}
          {scheduledTasks.length > 0 && (
            <Text style={styles.sectionHeader}>Scheduled</Text>
          )}
        </View>
      );
    },
    [flexibleTasks, scheduledTasks.length, toggleTaskCompletion, deleteTask, handleTaskPress, activeDate]
  );

  const listLayoutAnimation = useMemo(
    () => LinearTransition.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1.0)),
    []
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <DaySelector activeDate={activeDate} onSelectDate={setActiveDate} />

        <Animated.FlatList
          data={scheduledTasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={listLayoutAnimation}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
          onPress={handleOpenComposer}
        >
          <Plus size={24} color={colors.textPrimary} />
        </Pressable>

        <TaskComposer
          ref={bottomSheetRef}
          taskToEdit={selectedTask}
          selectedDateStr={activeDate}
          context="timeline"
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDismiss={handleDismiss}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
