import { forwardRef, useCallback, useState, useMemo } from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';

import { colors } from '../../types/theme';
import type { RecurrenceRule } from '../../types/task';
import { styles, COMPOSER_CONSTANTS } from './styles';

type RecurrenceOption = 'none' | 'daily' | 'weekly';

interface RecurrenceBadge {
  key: RecurrenceOption;
  label: string;
}

interface TaskComposerProps {
  onAddTask: (input: { title: string; recurrence?: RecurrenceRule }) => void;
}

const RECURRENCE_OPTIONS: RecurrenceBadge[] = [
  { key: 'none', label: 'Today' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
];

export const TaskComposer = forwardRef<BottomSheetModal, TaskComposerProps>(
  ({ onAddTask }, ref) => {
    const [title, setTitle] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceOption>('none');

    const snapPoints = useMemo(() => COMPOSER_CONSTANTS.snapPoints, []);

    const handleSave = useCallback(() => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;

      let recurrenceRule: RecurrenceRule | undefined;
      if (recurrence === 'daily') {
        recurrenceRule = { type: 'daily' };
      } else if (recurrence === 'weekly') {
        recurrenceRule = { type: 'weekly' };
      }

      onAddTask({ title: trimmedTitle, recurrence: recurrenceRule });

      // Reset and close
      setTitle('');
      setRecurrence('none');
      Keyboard.dismiss();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    }, [title, recurrence, onAddTask, ref]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const isDisabled = !title.trim();

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            placeholderTextColor={colors.textMuted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>

        <View style={styles.badgeRow}>
          {RECURRENCE_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              style={[
                styles.badge,
                recurrence === option.key && styles.badgeActive,
              ]}
              onPress={() => setRecurrence(option.key)}
            >
              <Text
                style={[
                  styles.badgeText,
                  recurrence === option.key && styles.badgeTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveButton,
              isDisabled && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isDisabled}
          >
            <Check
              size={COMPOSER_CONSTANTS.saveIconSize}
              color={isDisabled ? colors.textMuted : colors.textPrimary}
            />
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TaskComposer.displayName = 'TaskComposer';
