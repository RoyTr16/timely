import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../hooks/useTasks';
import { TaskRow } from '../../components';
import { colors } from '../../types/theme';
import type { Task } from '../../types/task';
import { styles } from './_styles';

export default function TimelineScreen() {
  const { tasks, addTask, toggleTask } = useTasks();
  const [inputText, setInputText] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    addTask({ title: trimmedText });
    setInputText('');
    Keyboard.dismiss();
  }, [inputText, addTask]);

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
        <Text style={styles.emptyText}>No tasks yet. Add one below!</Text>
      </View>
    ),
    []
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
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
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Add a task..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
