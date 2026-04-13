import { useCallback, useRef, useState } from 'react';
import { Pressable, View, Text } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Plus } from 'lucide-react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow, TaskComposer } from '../../components';
import { colors } from '../../types/theme';
import type { Task } from '../../types/task';
import { styles } from '../../styles/tabs';

export default function BacklogScreen() {
  const { backlogTasks, addTask, toggleTask, deleteTask, updateBacklogOrder } = useTasks();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<Task>) => (
      <ScaleDecorator>
        <TaskRow
          task={item}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onPress={handleTaskPress}
          onLongPress={drag}
          isBacklogContext
        />
      </ScaleDecorator>
    ),
    [toggleTask, deleteTask, handleTaskPress]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Inbox Zero</Text>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Backlog</Text>
          </View>

          <DraggableFlatList
            data={backlogTasks}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onDragEnd={({ data }) => updateBacklogOrder(data)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />

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
            onAddTask={addTask}
            onDismiss={handleDismiss}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
