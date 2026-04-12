import { useCallback, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow, TaskComposer } from '../../components';
import { colors } from '../../types/theme';
import type { Task } from '../../types/task';
import { styles } from './_styles';

export default function TimelineScreen() {
  const { tasks, addTask, toggleTask } = useTasks();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenComposer = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskRow task={item} onToggle={toggleTask} />
    ),
    [toggleTask]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks yet. Tap + to add one!</Text>
      </View>
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Today</Text>
        </View>

        <Animated.FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={LinearTransition.springify()}
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

        <TaskComposer ref={bottomSheetRef} onAddTask={addTask} />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
