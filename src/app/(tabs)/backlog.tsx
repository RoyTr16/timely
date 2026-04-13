import { useCallback, useRef, useState } from 'react';
import { Pressable, View, Text, Platform } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Plus } from 'lucide-react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow, TaskComposer } from '../../components';
import { colors } from '../../types/theme';
import { getFormattedDate } from '../../utils';
import type { Task } from '../../types/task';
import { styles, segmentStyles } from '../../styles/tabs';

export default function BacklogScreen() {
  const { inboxTasks, templateTasks, addTask, updateTask, toggleTaskCompletion, deleteTask, updateBacklogOrder } = useTasks();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'templates'>('inbox');
  const [taskToSchedule, setTaskToSchedule] = useState<Task | null>(null);

  const listData = activeTab === 'inbox' ? inboxTasks : templateTasks;

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    bottomSheetRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const handleAddPress = useCallback(() => {
    setSelectedTask(null);
    bottomSheetRef.current?.present();
  }, []);

  const handleScheduleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setTaskToSchedule(null);
      if (event.type === 'dismissed') {
        setTaskToSchedule(null);
        return;
      }
      if (selectedDate && taskToSchedule) {
        const dateStr = getFormattedDate(selectedDate);
        if (taskToSchedule.isTemplate) {
          addTask({
            title: taskToSchedule.title,
            recurrence: taskToSchedule.recurrence,
            startTime: taskToSchedule.startTime,
            durationMinutes: taskToSchedule.durationMinutes,
            energyLevel: taskToSchedule.energyLevel,
            color: taskToSchedule.color,
            icon: taskToSchedule.icon,
            scheduledDate: dateStr,
            recurrenceDays: taskToSchedule.recurrenceDays,
          });
        } else {
          updateTask(taskToSchedule.id, { scheduledDate: dateStr });
        }
        setTaskToSchedule(null);
      }
    },
    [taskToSchedule, addTask, updateTask]
  );

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<Task>) => (
      <ScaleDecorator>
        <TaskRow
          task={item}
          onToggle={toggleTaskCompletion}
          onDelete={deleteTask}
          onPress={handleTaskPress}
          onLongPress={drag}
          onQuickSchedule={() => setTaskToSchedule(item)}
          isBacklogContext
        />
      </ScaleDecorator>
    ),
    [toggleTaskCompletion, deleteTask, handleTaskPress]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {activeTab === 'inbox' ? 'Inbox Zero' : 'No templates yet'}
        </Text>
      </View>
    ),
    [activeTab]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Backlog</Text>
          </View>

          <View style={segmentStyles.container}>
            <Pressable
              style={[segmentStyles.tab, activeTab === 'inbox' && segmentStyles.tabActive]}
              onPress={() => setActiveTab('inbox')}
            >
              <Text style={[segmentStyles.tabText, activeTab === 'inbox' && segmentStyles.tabTextActive]}>
                Inbox
              </Text>
            </Pressable>
            <Pressable
              style={[segmentStyles.tab, activeTab === 'templates' && segmentStyles.tabActive]}
              onPress={() => setActiveTab('templates')}
            >
              <Text style={[segmentStyles.tabText, activeTab === 'templates' && segmentStyles.tabTextActive]}>
                Templates
              </Text>
            </Pressable>
          </View>

          <DraggableFlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onDragEnd={({ data }) => updateBacklogOrder(data)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />

          {taskToSchedule && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleScheduleDateChange}
              themeVariant="dark"
            />
          )}

          <Pressable
            style={({ pressed }) => [
              styles.fab,
              pressed && styles.fabPressed,
            ]}
            onPress={handleAddPress}
          >
            <Plus size={24} color={colors.textPrimary} />
          </Pressable>

          <TaskComposer
            ref={bottomSheetRef}
            templateTask={selectedTask}
            context="backlog"
            defaultIsTemplate={activeTab === 'templates'}
            onAddTask={addTask}
            onDismiss={handleDismiss}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
