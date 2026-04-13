import { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { colors } from '../../types/theme';
import { getFormattedDate, getTodayStr } from '../../utils';
import { styles } from './styles';

interface DayItem {
  dateStr: string;
  weekday: string;
  dayNumber: number;
  isToday: boolean;
}

interface DaySelectorProps {
  activeDate: string;
  onSelectDate: (date: string) => void;
}

const SHORT_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getSundayOfWeek(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  return date;
}

function generateWeek(sundayDate: Date): DayItem[] {
  const today = getTodayStr();
  const days: DayItem[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sundayDate);
    date.setDate(sundayDate.getDate() + i);
    const dateStr = getFormattedDate(date);
    days.push({
      dateStr,
      weekday: SHORT_WEEKDAYS[i],
      dayNumber: date.getDate(),
      isToday: dateStr === today,
    });
  }
  return days;
}

export function DaySelector({ activeDate, onSelectDate }: DaySelectorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);

  const SLIDE_EASING = Easing.bezier(0.25, 0.1, 0.25, 1.0);

  const slideIn = useCallback((direction: 'left' | 'right') => {
    const offset = direction === 'left' ? -screenWidth * 0.3 : screenWidth * 0.3;
    translateX.value = offset;
    translateX.value = withTiming(0, { duration: 280, easing: SLIDE_EASING });
  }, [screenWidth, translateX, SLIDE_EASING]);

  const weekAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: 1 - Math.abs(translateX.value) / 200,
  }));

  const sunday = useMemo(() => getSundayOfWeek(activeDate), [activeDate]);
  const week = useMemo(() => generateWeek(sunday), [sunday]);

  const activeDateObj = useMemo(() => {
    const [y, m, d] = activeDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [activeDate]);

  const monthYearLabel = useMemo(() => {
    return `${MONTH_NAMES[activeDateObj.getMonth()]} ${activeDateObj.getFullYear()}`;
  }, [activeDateObj]);

  const isNotToday = activeDate !== getTodayStr();

  const handlePrevWeek = useCallback(() => {
    slideIn('left');
    const newDate = new Date(activeDateObj);
    newDate.setDate(newDate.getDate() - 7);
    onSelectDate(getFormattedDate(newDate));
  }, [activeDateObj, onSelectDate, slideIn]);

  const handleNextWeek = useCallback(() => {
    slideIn('right');
    const newDate = new Date(activeDateObj);
    newDate.setDate(newDate.getDate() + 7);
    onSelectDate(getFormattedDate(newDate));
  }, [activeDateObj, onSelectDate, slideIn]);

  const handleDatePickerChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setShowPicker(false);
      if (event.type === 'dismissed') return;
      if (selectedDate) {
        onSelectDate(getFormattedDate(selectedDate));
        if (Platform.OS === 'ios') setShowPicker(false);
      }
    },
    [onSelectDate]
  );

  const handleMonthYearPress = useCallback(() => {
    setShowPicker(true);
  }, []);

  const swipeGesture = useMemo(() =>
    Gesture.Pan()
      .activeOffsetX([-30, 30])
      .runOnJS(true)
      .onEnd((e) => {
        if (e.translationX < -50) {
          handleNextWeek();
        } else if (e.translationX > 50) {
          handlePrevWeek();
        }
      }),
    [handlePrevWeek, handleNextWeek]
  );

  return (
    <View style={styles.container}>
      {/* Month/Year Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [styles.chevronButton, pressed && { opacity: 0.7 }]}
            onPress={handlePrevWeek}
          >
            <ChevronLeft size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [styles.headerCenter, pressed && { opacity: 0.7 }]}
          onPress={handleMonthYearPress}
        >
          <Text style={styles.monthYearText}>{monthYearLabel}</Text>
        </Pressable>
        <View style={styles.headerRight}>
          {isNotToday && (
            <Pressable
              style={({ pressed }) => [styles.todayPill, pressed && { opacity: 0.7 }]}
              onPress={() => onSelectDate(getTodayStr())}
            >
              <Text style={styles.todayPillText}>Today</Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [styles.chevronButton, pressed && { opacity: 0.7 }]}
            onPress={handleNextWeek}
          >
            <ChevronRight size={24} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Week Row */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.weekRow, weekAnimatedStyle]}>
          {week.map((item) => {
            const isActive = item.dateStr === activeDate;
            return (
              <Pressable
                key={item.dateStr}
                style={({ pressed }) => [
                  styles.dayItem,
                  isActive && styles.dayItemActive,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => onSelectDate(item.dateStr)}
              >
                <Text style={[styles.weekdayText, isActive && styles.weekdayTextActive]}>
                  {item.weekday}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  isActive && styles.dayNumberActive,
                  item.isToday && !isActive && styles.dayNumberToday,
                ]}>
                  {item.dayNumber}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      </GestureDetector>

      {/* Native Calendar Picker */}
      {showPicker && (
        <DateTimePicker
          value={activeDateObj}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDatePickerChange}
          themeVariant="dark"
        />
      )}
    </View>
  );
}
