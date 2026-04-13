import { forwardRef, useCallback, useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, Keyboard, ScrollView, Platform, Modal, FlatList } from 'react-native';

import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Bookmark, CalendarClock, Check, Calendar, Clock, Zap, Palette, Play, Square, MoreHorizontal, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors, palette } from '../../types/theme';
import type { Task, RecurrenceRule, EnergyLevel } from '../../types/task';
import { ICON_REGISTRY, ICON_NAMES, QUICK_ICON_NAMES } from '../../utils';
import { styles, COMPOSER_CONSTANTS } from './styles';

type RecurrenceOption = 'none' | 'daily' | 'weekly';
type ActiveTool = 'schedule' | 'energy' | 'style' | null;
type ActivePicker = 'start' | 'end' | 'date' | null;

interface RecurrenceBadge {
  key: RecurrenceOption;
  label: string;
}

interface TaskComposerProps {
  taskToEdit?: Task | null;
  templateTask?: Task | null;
  selectedDateStr?: string;
  context?: 'timeline' | 'backlog';
  defaultIsTemplate?: boolean;
  onAddTask: (input: {
    title: string;
    recurrence?: RecurrenceRule;
    startTime?: string;
    durationMinutes?: number;
    energyLevel?: EnergyLevel;
    color?: string;
    icon?: string;
    scheduledDate?: string;
    isTemplate?: boolean;
    recurrenceDays?: number[];
  }) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDismiss?: () => void;
}

const RECURRENCE_OPTIONS: RecurrenceBadge[] = [
  { key: 'none', label: 'None' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
  { value: 120, label: '2h' },
];

const ENERGY_OPTIONS: { value: EnergyLevel; label: string; color: string }[] = [
  { value: 1, label: 'Brain Dead', color: '#3B82F6' },
  { value: 2, label: 'Low Gear', color: '#06B6D4' },
  { value: 3, label: 'Steady', color: '#22C55E' },
  { value: 4, label: 'Focused', color: '#F59E0B' },
  { value: 5, label: 'Deep Focus', color: '#EF4444' },
];

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const TaskComposer = forwardRef<BottomSheetModal, TaskComposerProps>(
  ({ taskToEdit, templateTask, selectedDateStr, context = 'timeline', defaultIsTemplate = false, onAddTask, onUpdateTask, onDismiss }, ref) => {
    const [title, setTitle] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceOption>('none');
    const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
    const [activeTool, setActiveTool] = useState<ActiveTool>('schedule');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [durationMinutes, setDurationMinutes] = useState<number>(30);
    const [activePicker, setActivePicker] = useState<ActivePicker>(null);
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [composerDate, setComposerDate] = useState<Date | null>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isTemplate, setIsTemplate] = useState(defaultIsTemplate);
    const [customHex, setCustomHex] = useState('');
    const [showIconModal, setShowIconModal] = useState(false);

    // Sync isTemplate when defaultIsTemplate changes (e.g. tab switch)
    useEffect(() => {
      if (!taskToEdit && !templateTask) {
        setIsTemplate(defaultIsTemplate);
      }
    }, [defaultIsTemplate, taskToEdit, templateTask]);

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
        setIsTemplate(taskToEdit.isTemplate ?? false);
        setRecurrenceDays(taskToEdit.recurrenceDays ?? []);

        if (taskToEdit.scheduledDate) {
          const [y, m, d] = taskToEdit.scheduledDate.split('-').map(Number);
          setComposerDate(new Date(y, m - 1, d));
        } else if (selectedDateStr) {
          const [y, m, d] = selectedDateStr.split('-').map(Number);
          setComposerDate(new Date(y, m - 1, d));
        } else if (context === 'timeline') {
          setComposerDate(new Date());
        } else {
          setComposerDate(null);
        }

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
    }, [taskToEdit, selectedDateStr]);

    // Pre-fill state when spawning from a template (backlog task)
    useEffect(() => {
      if (templateTask) {
        setTitle(templateTask.title);
        setDurationMinutes(templateTask.durationMinutes ?? 30);
        setEnergyLevel(templateTask.energyLevel ?? null);
        setSelectedColor(templateTask.color ?? null);
        setSelectedIcon(templateTask.icon ?? null);
        setIsTemplate(false); // Spawned tasks are not templates
        setRecurrenceDays(templateTask.recurrenceDays ?? []);

        if (templateTask.scheduledDate) {
          const [y, m, d] = templateTask.scheduledDate.split('-').map(Number);
          setComposerDate(new Date(y, m - 1, d));
        } else if (selectedDateStr) {
          const [y, m, d] = selectedDateStr.split('-').map(Number);
          setComposerDate(new Date(y, m - 1, d));
        } else if (context === 'timeline') {
          setComposerDate(new Date());
        } else {
          setComposerDate(null);
        }

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
    }, [templateTask, selectedDateStr]);

    const resetState = useCallback(() => {
      setTitle('');
      setRecurrence('none');
      setRecurrenceDays([]);
      setActiveTool('schedule');
      setStartDate(new Date());
      setDurationMinutes(30);
      setActivePicker(null);
      setEnergyLevel(null);
      setSelectedColor(null);
      setSelectedIcon(null);
      setComposerDate(context === 'timeline' ? new Date() : null);
      setShowDatePicker(false);
      setIsTemplate(defaultIsTemplate);
      setCustomHex('');
      setShowIconModal(false);
    }, [context, defaultIsTemplate]);

    const handleToolPress = useCallback((tool: ActiveTool) => {
      setActiveTool((prev) => (prev === tool ? null : tool));
      setActivePicker(null);
      setShowDatePicker(false);
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

    // Format Date to "YYYY-MM-DD" string
    const formatDate = useCallback((date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }, []);

    const handleDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setActivePicker(null);
      if (event.type === 'dismissed') return;
      if (selectedDate) {
        setComposerDate(selectedDate);
      }
    }, []);

    // Format for display: "Apr 14"
    const formatShortDate = useCallback((date: Date): string => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const toggleWeekday = useCallback((day: number) => {
      setRecurrenceDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }, []);

    const handleCustomHex = useCallback((text: string) => {
      const clean = text.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
      setCustomHex(clean);
      if (clean.length === 6) {
        setSelectedColor(`#${clean}`);
      }
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
      const finalDate = composerDate ? formatDate(composerDate) : selectedDateStr;
      const finalRecurrenceDays = recurrence === 'weekly' && recurrenceDays.length > 0
        ? recurrenceDays
        : undefined;

      if (taskToEdit && onUpdateTask) {
        onUpdateTask(taskToEdit.id, {
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTimeStr,
          durationMinutes,
          energyLevel: energyLevel ?? undefined,
          color: selectedColor ?? undefined,
          icon: selectedIcon ?? undefined,
          scheduledDate: finalDate,
          isTemplate: isTemplate || undefined,
          recurrenceDays: finalRecurrenceDays,
        });
      } else {
        onAddTask({
          title: trimmedTitle,
          recurrence: recurrenceRule,
          startTime: startTimeStr,
          durationMinutes,
          energyLevel: energyLevel ?? undefined,
          color: selectedColor ?? undefined,
          icon: selectedIcon ?? undefined,
          scheduledDate: finalDate,
          isTemplate: isTemplate || undefined,
          recurrenceDays: finalRecurrenceDays,
        });
      }

      resetState();
      Keyboard.dismiss();
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    }, [title, recurrence, recurrenceDays, startDate, formatTime, formatDate, durationMinutes, energyLevel, selectedColor, selectedIcon, composerDate, selectedDateStr, isTemplate, taskToEdit, templateTask, onAddTask, onUpdateTask, resetState, ref]);

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
            style={[styles.toolButton, activeTool === 'schedule' && styles.toolButtonActive]}
            onPress={() => handleToolPress('schedule')}
          >
            <CalendarClock
              size={20}
              color={activeTool === 'schedule' ? colors.accent : colors.textMuted}
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
            style={[styles.toolButton, activeTool === 'style' && styles.toolButtonActive]}
            onPress={() => handleToolPress('style')}
          >
            <Palette
              size={20}
              color={activeTool === 'style' || selectedColor || selectedIcon ? colors.accent : colors.textMuted}
            />
          </Pressable>
          {context === 'backlog' && (
            <Pressable
              style={[styles.toolButton, isTemplate && styles.toolButtonActive]}
              onPress={() => {
                setIsTemplate((prev) => !prev);
                Haptics.selectionAsync();
              }}
            >
              <Bookmark
                size={20}
                color={isTemplate ? colors.accent : colors.textMuted}
                fill={isTemplate ? colors.accent : 'transparent'}
              />
            </Pressable>
          )}
        </View>

        {/* === SCHEDULE TAB === */}
        {activeTool === 'schedule' && (
          <View style={styles.controlArea}>
            {/* Date & Time row */}
            <View style={styles.scheduleRow}>
              <Pressable
                style={[styles.scheduleButton, activePicker === 'date' && styles.scheduleButtonActive]}
                onPress={() => setActivePicker(activePicker === 'date' ? null : 'date')}
              >
                <Calendar size={14} color={composerDate ? colors.accent : colors.textMuted} />
                <Text style={styles.scheduleButtonText}>
                  {composerDate
                    ? formatShortDate(composerDate)
                    : context === 'backlog'
                      ? 'Not Scheduled'
                      : formatShortDate(new Date())}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.scheduleButton, activePicker === 'start' && styles.scheduleButtonActive]}
                onPress={() => setActivePicker(activePicker === 'start' ? null : 'start')}
              >
                <Clock size={14} color={colors.accent} />
                <Text style={styles.scheduleButtonText}>{formatTime(startDate)}</Text>
              </Pressable>
              <Pressable
                style={[styles.scheduleButton, activePicker === 'end' && styles.scheduleButtonActive]}
                onPress={() => setActivePicker(activePicker === 'end' ? null : 'end')}
              >
                <Square size={12} color={colors.textMuted} />
                <Text style={styles.scheduleButtonText}>{formatTime(endDate)}</Text>
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

            {/* Recurrence Type */}
            <View style={styles.recurrenceRow}>
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

            {/* Weekly Day Selector */}
            {recurrence === 'weekly' && (
              <View style={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.weekdayButton,
                      recurrenceDays.includes(index) && styles.weekdayButtonActive,
                    ]}
                    onPress={() => toggleWeekday(index)}
                  >
                    <Text
                      style={[
                        styles.weekdayText,
                        recurrenceDays.includes(index) && styles.weekdayTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Native Pickers */}
            {Platform.OS === 'ios' && activePicker === 'date' && (
              <>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={composerDate ?? new Date()}
                    mode="date"
                    display="inline"
                    onChange={handleDateChange}
                    themeVariant="dark"
                  />
                </View>
                <Pressable style={styles.pickerDoneButton} onPress={() => setActivePicker(null)}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </Pressable>
              </>
            )}
            {Platform.OS === 'ios' && (activePicker === 'start' || activePicker === 'end') && (
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
            {Platform.OS === 'android' && activePicker === 'date' && (
              <DateTimePicker
                value={composerDate ?? new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            {Platform.OS === 'android' && (activePicker === 'start' || activePicker === 'end') && (
              <DateTimePicker
                value={activePicker === 'start' ? startDate : endDate}
                mode="time"
                display="default"
                onChange={activePicker === 'start' ? handleStartTimeChange : handleEndTimeChange}
              />
            )}
          </View>
        )}

        {/* === ENERGY TAB === */}
        {activeTool === 'energy' && (
          <View style={styles.controlArea}>
            <View style={styles.energyRow}>
              {ENERGY_OPTIONS.map((option) => {
                const isSelected = energyLevel === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.energyBlock,
                      { borderColor: isSelected ? option.color : 'transparent' },
                      isSelected && styles.energyBlockActive,
                    ]}
                    onPress={() => {
                      setEnergyLevel(isSelected ? null : option.value);
                      Haptics.selectionAsync();
                    }}
                  >
                    <View style={[styles.energyFill, { backgroundColor: isSelected ? option.color : colors.surfaceElevated }]} />
                    <Text style={[styles.energyValue, isSelected && { color: option.color }]}>
                      {option.value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.energyLabel}>
              {energyLevel
                ? ENERGY_OPTIONS.find((o) => o.value === energyLevel)?.label ?? ''
                : 'Tap to set energy'}
            </Text>
          </View>
        )}

        {/* === STYLE TAB === */}
        {activeTool === 'style' && (
          <View style={styles.controlArea}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.swatchRow}
            >
              {palette.map((swatchColor) => (
                <Pressable
                  key={swatchColor}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: swatchColor },
                    selectedColor === swatchColor && styles.colorSwatchActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedColor(selectedColor === swatchColor ? null : swatchColor);
                    setCustomHex('');
                  }}
                />
              ))}
            </ScrollView>
            <View style={styles.hexInputRow}>
              <Text style={styles.hexPrefix}>#</Text>
              <BottomSheetTextInput
                style={styles.hexInput}
                value={customHex}
                onChangeText={handleCustomHex}
                placeholder="Custom hex"
                placeholderTextColor={colors.textMuted}
                maxLength={6}
                autoCapitalize="none"
              />
              {customHex.length === 6 && (
                <View style={[styles.hexPreview, { backgroundColor: `#${customHex}` }]} />
              )}
            </View>
            <View style={styles.iconGrid}>
              {QUICK_ICON_NAMES.map((iconName) => {
                const IconComp = ICON_REGISTRY[iconName];
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
                    <IconComp size={20} color={iconColor} />
                  </Pressable>
                );
              })}
              <Pressable
                style={styles.iconGridItem}
                onPress={() => setShowIconModal(true)}
              >
                <MoreHorizontal size={20} color={colors.textMuted} />
              </Pressable>
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

        {/* === ICON PICKER MODAL === */}
        <Modal
          visible={showIconModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowIconModal(false)}
        >
          <View style={styles.iconModalContainer}>
            <View style={styles.iconModalHeader}>
              <Text style={styles.iconModalTitle}>Choose Icon</Text>
              <Pressable
                style={styles.iconModalClose}
                onPress={() => setShowIconModal(false)}
              >
                <X size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <FlatList
              data={ICON_NAMES}
              numColumns={5}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.iconModalGrid}
              columnWrapperStyle={styles.iconModalRow}
              renderItem={({ item: iconName }) => {
                const IconComp = ICON_REGISTRY[iconName];
                const isSelected = selectedIcon === iconName;
                const iconColor = isSelected
                  ? selectedColor || colors.accent
                  : colors.textSecondary;
                return (
                  <Pressable
                    style={[
                      styles.iconModalItem,
                      isSelected && styles.iconModalItemActive,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedIcon(isSelected ? null : iconName);
                      setShowIconModal(false);
                    }}
                  >
                    <IconComp size={24} color={iconColor} />
                    <Text
                      style={[
                        styles.iconModalLabel,
                        isSelected && styles.iconModalLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {iconName}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </Modal>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TaskComposer.displayName = 'TaskComposer';
