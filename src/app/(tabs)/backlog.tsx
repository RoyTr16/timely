import { useCallback } from 'react';
import { View, Text } from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow } from '../../components';
import type { Task } from '../../types/task';
import { styles } from './_styles';

export default function BacklogScreen() {
  const { backlogTasks, toggleTask, deleteTask } = useTasks();

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskRow task={item} onToggle={toggleTask} onDelete={deleteTask} />
    ),
    [toggleTask, deleteTask]
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
    </SafeAreaView>
  );
}
