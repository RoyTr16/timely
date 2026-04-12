import { useCallback, useRef, useState } from 'react';
import { View, Text } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow, TaskComposer } from '../../components';
import type { Task } from '../../types/task';
import { styles } from '../../styles/tabs';

export default function BacklogScreen() {
  const { backlogTasks, addTask, updateTask, toggleTask, deleteTask } = useTasks();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    bottomSheetRef.current?.present();
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskRow
        task={item}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onPress={handleTaskPress}
      />
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
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Backlog</Text>
        </View>

        <Animated.FlatList
          data={backlogTasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={LinearTransition.springify()}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />

        <TaskComposer
          ref={bottomSheetRef}
          taskToEdit={selectedTask}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDismiss={handleDismiss}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
