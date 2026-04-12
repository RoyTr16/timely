import { forwardRef, useCallback, useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, Keyboard, ScrollView, Platform } from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Check, Clock, Zap, Repeat, Palette, Play, Square } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors, palette } from '../../types/theme';
import type { Task, RecurrenceRule, EnergyLevel } from '../../types/task';
import { ICON_REGISTRY, ICON_NAMES } from '../../utils';
import { styles, COMPOSER_CONSTANTS } from './styles';

type RecurrenceOption = 'none' | 'daily' | 'weekly';
type ActiveTool = 'time' | 'energy' | 'recurrence' | 'style' | null;
type ActivePicker = 'start' | 'end' | null;

interface RecurrenceBadge {
  key: RecurrenceOption;
  label: string;
}

interface TaskComposerProps {
  taskToEdit?: Task | null;
  templateTask?: Task | null;
  selectedDateStr?: string;
  onAddTask: (input: {
    title: string;
    recurrence?: RecurrenceRule;
    startTime?: string;
    durationMinutes?: number;
    energyLevel?: EnergyLevel;
    color?: string;
    icon?: string;
    scheduledDate?: string;
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
  ({ taskToEdit, templateTask, selectedDateStr, onAddTask, onUpdateTask, onDismiss }, ref) => {
    const [title, setTitle] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceOption>('none');
    const [activeTool, setActiveTool] = useState<ActiveTool>('time');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [durationMinutes, setDurationMinutes] = useState<number>(30);
    const [activePicker, setActivePicker] = useState<ActivePicker>(null);
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    const snapPoints = useMemo(() => COMPOSER_CONSTANTS.snapPoints, []);

    // Derive endDate from startDate + durationMinutes
    const endDate = useMemo(() => {
      return new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    }, [startDate, durationMinutes]);

    // Pre-fill state when editing an existing task
    useEffect(() => {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDurationMinutes(taskToEdit.durationMinutes ?? 30);
        setEnergyLevel(taskToEdit.energyLevel ?? null);
        setSelectedColor(taskToEdit.color ?? null);
        setSelectedIcon(taskToEdit.icon ?? null);

        // Parse startTime into startDate
        if (taskToEdit.startTime) {
          const [hours, minutes] = taskToEdit.startTime.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          setStartDate(date);
        } else {
          setStartDate(new Date());
        }

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

    // Pre-fill state when spawning from a template (backlog task)
    useEffect(() => {
      if (templateTask) {
        setTitle(templateTask.title);
        setDurationMinutes(templateTask.durationMinutes ?? 30);
        setEnergyLevel(templateTask.energyLevel ?? null);
        setSelectedColor(templateTask.color ?? null);
        setSelectedIcon(templateTask.icon ?? null);

        // Parse startTime into startDate
        if (templateTask.startTime) {
          const [hours, minutes] = templateTask.startTime.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          setStartDate(date);
        } else {
          setStartDate(new Date());
        }

        // Determine recurrence option
        if (!templateTask.recurrence) {
          setRecurrence('none');
        } else if (templateTask.recurrence.type === 'daily') {
          setRecurrence('daily');
        } else if (templateTask.recurrence.type === 'weekly') {
          setRecurrence('weekly');
        } else {
          setRecurrence('none');
        }
      }
    }, [templateTask]);

    const resetState = useCallback(() => {
      setTitle('');
      setRecurrence('none');
      setActiveTool('time');
      setStartDate(new Date());
      setDurationMinutes(30);
      setActivePicker(null);
      setEnergyLevel(null);
      setSelectedColor(null);
      setSelectedIcon(null);
    }, []);

    const handleToolPress = useCallback((tool: ActiveTool) => {
      setActiveTool((prev) => (prev === tool ? null : tool));
      setActivePicker(null); // Reset picker when switching tools
    }, []);

    const handleStartTimeChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setActivePicker(null);
      if (event.type === 'dismissed') return;
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    }, []);

    const handleEndTimeChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setActivePicker(null);
      if (event.type === 'dismissed') return;
      if (selectedDate) {
        // Calculate new duration from end time - start time
        const diffMs = selectedDate.getTime() - startDate.getTime();
        const diffMins = Math.max(0, Math.round(diffMs / 60000));
        setDurationMinutes(diffMins || 15); // Minimum 15 minutes
      }
    }, [startDate]);

    // Format Date to "HH:mm" string
    const formatTime = useCallback((date: Date): string => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
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

      const startTimeStr = formatTime(startDate);

      if (taskToEdit && onUpdateTask) {
        // Update existing task
        onUpdateTask(taskToEdit.id, {
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTimeStr,
          durationMinutes,
          energyLevel: energyLevel ?? undefined,
          color: selectedColor ?? undefined,
          icon: selectedIcon ?? undefined,
        });
      } else {
        // Create new task (from scratch or from template)
        onAddTask({
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTimeStr,
          durationMinutes,
          energyLevel: energyLevel ?? undefined,
          color: selectedColor ?? undefined,
          icon: selectedIcon ?? undefined,
          scheduledDate: selectedDateStr,
        });
      }

      // Reset and close
      resetState();
      Keyboard.dismiss();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    }, [title, recurrence, startDate, formatTime, durationMinutes, energyLevel, selectedColor, selectedIcon, selectedDateStr, taskToEdit, onAddTask, onUpdateTask, resetState, ref]);

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
              color={activeTool === 'time' ? colors.accent : colors.textMuted}
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
          <Pressable
            style={[styles.toolButton, activeTool === 'style' && styles.toolButtonActive]}
            onPress={() => handleToolPress('style')}
          >
            <Palette
              size={20}
              color={activeTool === 'style' || selectedColor || selectedIcon ? colors.accent : colors.textMuted}
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
            {/* Start/End Time Buttons */}
            <View style={styles.timeButtonRow}>
              <Pressable
                style={[styles.timeButton, activePicker === 'start' && styles.timeButtonActive]}
                onPress={() => setActivePicker(activePicker === 'start' ? null : 'start')}
              >
                <Play size={14} color={colors.accent} />
                <Text style={styles.timeButtonText}>{formatTime(startDate)}</Text>
              </Pressable>
              <Pressable
                style={[styles.timeButton, activePicker === 'end' && styles.timeButtonActive]}
                onPress={() => setActivePicker(activePicker === 'end' ? null : 'end')}
              >
                <Square size={14} color={colors.textMuted} />
                <Text style={styles.timeButtonText}>{formatTime(endDate)}</Text>
              </Pressable>
            </View>
            {/* Duration Pills */}
            <View style={styles.durationRow}>
              {DURATION_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.badge,
                    durationMinutes === option.value && styles.badgeActive,
                  ]}
                  onPress={() => setDurationMinutes(option.value)}
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
            {/* iOS: Inline Spinner with Done button */}
            {Platform.OS === 'ios' && activePicker !== null && (
              <>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={activePicker === 'start' ? startDate : endDate}
                    mode="time"
                    display="spinner"
                    onChange={activePicker === 'start' ? handleStartTimeChange : handleEndTimeChange}
                    themeVariant="dark"
                  />
                </View>
                <Pressable style={styles.pickerDoneButton} onPress={() => setActivePicker(null)}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </Pressable>
              </>
            )}
            {/* Android: Invisible trigger that launches native modal */}
            {Platform.OS === 'android' && activePicker !== null && (
              <DateTimePicker
                value={activePicker === 'start' ? startDate : endDate}
                mode="time"
                display="default"
                onChange={activePicker === 'start' ? handleStartTimeChange : handleEndTimeChange}
              />
            )}
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

        {activeTool === 'style' && (
          <View style={styles.controlArea}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.swatchRow}
            >
              {palette.map((color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSwatchActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedColor(selectedColor === color ? null : color);
                  }}
                />
              ))}
            </ScrollView>
            <View style={styles.iconGrid}>
              {ICON_NAMES.map((iconName) => {
                const IconComponent = ICON_REGISTRY[iconName];
                const isSelected = selectedIcon === iconName;
                const iconColor = isSelected
                  ? selectedColor || colors.accent
                  : colors.textMuted;
                return (
                  <Pressable
                    key={iconName}
                    style={[
                      styles.iconGridItem,
                      isSelected && styles.iconGridItemActive,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedIcon(isSelected ? null : iconName);
                    }}
                  >
                    <IconComponent size={20} color={iconColor} />
                  </Pressable>
                );
              })}
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
