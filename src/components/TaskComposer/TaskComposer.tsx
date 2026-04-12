import { forwardRef, useCallback, useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, Keyboard, TextInput } from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Check, Clock, Zap, Repeat } from 'lucide-react-native';

import { colors } from '../../types/theme';
import type { Task, RecurrenceRule, EnergyLevel } from '../../types/task';
import { styles, COMPOSER_CONSTANTS } from './styles';

type RecurrenceOption = 'none' | 'daily' | 'weekly';
type ActiveTool = 'time' | 'energy' | 'recurrence' | null;

interface RecurrenceBadge {
  key: RecurrenceOption;
  label: string;
}

interface TaskComposerProps {
  taskToEdit?: Task | null;
  onAddTask: (input: {
    title: string;
    recurrence?: RecurrenceRule;
    startTime?: string;
    durationMinutes?: number;
    energyLevel?: EnergyLevel;
  }) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDismiss?: () => void;
}

const RECURRENCE_OPTIONS: RecurrenceBadge[] = [
  { key: 'none', label: 'Today' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
];

const ENERGY_OPTIONS: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: '⚡ Low' },
  { value: 2, label: '⚡⚡ Med' },
  { value: 3, label: '⚡⚡⚡ High' },
];

export const TaskComposer = forwardRef<BottomSheetModal, TaskComposerProps>(
  ({ taskToEdit, onAddTask, onUpdateTask, onDismiss }, ref) => {
    const [title, setTitle] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceOption>('none');
    const [activeTool, setActiveTool] = useState<ActiveTool>(null);
    const [startTime, setStartTime] = useState('');
    const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);

    const snapPoints = useMemo(() => COMPOSER_CONSTANTS.snapPoints, []);

    // Pre-fill state when editing an existing task
    useEffect(() => {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setStartTime(taskToEdit.startTime ?? '');
        setDurationMinutes(taskToEdit.durationMinutes ?? null);
        setEnergyLevel(taskToEdit.energyLevel ?? null);

        // Determine recurrence option
        if (!taskToEdit.recurrence) {
          setRecurrence('none');
        } else if (taskToEdit.recurrence.type === 'daily') {
          setRecurrence('daily');
        } else if (taskToEdit.recurrence.type === 'weekly') {
          setRecurrence('weekly');
        } else {
          setRecurrence('none');
        }
      }
    }, [taskToEdit]);

    const resetState = useCallback(() => {
      setTitle('');
      setRecurrence('none');
      setActiveTool(null);
      setStartTime('');
      setDurationMinutes(null);
      setEnergyLevel(null);
    }, []);

    const handleToolPress = useCallback((tool: ActiveTool) => {
      setActiveTool((prev) => (prev === tool ? null : tool));
    }, []);

    const handleSave = useCallback(() => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;

      let recurrenceRule: RecurrenceRule | undefined;
      if (recurrence === 'daily') {
        recurrenceRule = { type: 'daily' };
      } else if (recurrence === 'weekly') {
        recurrenceRule = { type: 'weekly' };
      }

      if (taskToEdit && onUpdateTask) {
        // Update existing task
        onUpdateTask(taskToEdit.id, {
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTime || undefined,
          durationMinutes: durationMinutes ?? undefined,
          energyLevel: energyLevel ?? undefined,
        });
      } else {
        // Create new task
        onAddTask({
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTime || undefined,
          durationMinutes: durationMinutes ?? undefined,
          energyLevel: energyLevel ?? undefined,
        });
      }

      // Reset and close
      resetState();
      Keyboard.dismiss();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    }, [title, recurrence, startTime, durationMinutes, energyLevel, taskToEdit, onAddTask, onUpdateTask, resetState, ref]);

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

  const handleSheetDismiss = useCallback(() => {
    resetState();
    onDismiss?.();
  }, [resetState, onDismiss]);

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
      onDismiss={handleSheetDismiss}
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

        {/* Toolbox Icon Row */}
        <View style={styles.toolboxRow}>
          <Pressable
            style={[styles.toolButton, activeTool === 'time' && styles.toolButtonActive]}
            onPress={() => handleToolPress('time')}
          >
            <Clock
              size={20}
              color={activeTool === 'time' || startTime || durationMinutes ? colors.accent : colors.textMuted}
            />
          </Pressable>
          <Pressable
            style={[styles.toolButton, activeTool === 'energy' && styles.toolButtonActive]}
            onPress={() => handleToolPress('energy')}
          >
            <Zap
              size={20}
              color={activeTool === 'energy' || energyLevel ? colors.accent : colors.textMuted}
            />
          </Pressable>
          <Pressable
            style={[styles.toolButton, activeTool === 'recurrence' && styles.toolButtonActive]}
            onPress={() => handleToolPress('recurrence')}
          >
            <Repeat
              size={20}
              color={activeTool === 'recurrence' || recurrence !== 'none' ? colors.accent : colors.textMuted}
            />
          </Pressable>
        </View>

        {/* Inline Control Area */}
        {activeTool === 'energy' && (
          <View style={styles.controlArea}>
            <View style={styles.badgeRow}>
              {ENERGY_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.badge,
                    energyLevel === option.value && styles.badgeActive,
                  ]}
                  onPress={() => setEnergyLevel(energyLevel === option.value ? null : option.value)}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      energyLevel === option.value && styles.badgeTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTool === 'time' && (
          <View style={styles.controlArea}>
            <View style={styles.timeRow}>
              <TextInput
                style={styles.timeInput}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:mm"
                placeholderTextColor={colors.textMuted}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
              <View style={styles.durationRow}>
                {DURATION_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.badge,
                      durationMinutes === option.value && styles.badgeActive,
                    ]}
                    onPress={() => setDurationMinutes(durationMinutes === option.value ? null : option.value)}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        durationMinutes === option.value && styles.badgeTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTool === 'recurrence' && (
          <View style={styles.controlArea}>
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
          </View>
        )}

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
