import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Platform } from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { colors } from '../../types/theme';
import { getFormattedDate } from '../../utils';
import { styles, DAY_SELECTOR_CONSTANTS } from './styles';

interface DayItem {
  dateStr: string;
  weekday: string;
  dayNumber: number;
}

interface DaySelectorProps {
  activeDate: string;
  onSelectDate: (date: string) => void;
}

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function generateDaysAroundDate(centerDateStr: string): DayItem[] {
  const days: DayItem[] = [];
  const centerDate = new Date(centerDateStr);

  // Generate window: 7 days before + center day + 14 days after
  for (let i = -DAY_SELECTOR_CONSTANTS.pastDays; i <= DAY_SELECTOR_CONSTANTS.futureDays; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);

    days.push({
      dateStr: getFormattedDate(date),
      weekday: SHORT_WEEKDAYS[date.getDay()],
      dayNumber: date.getDate(),
    });
  }

  return days;
}

export function DaySelector({ activeDate, onSelectDate }: DaySelectorProps) {
  const flatListRef = useRef<FlatList<DayItem>>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Parse activeDate for display
  const activeDateObj = useMemo(() => new Date(activeDate), [activeDate]);
  const monthYearLabel = useMemo(() => {
    return `${MONTH_NAMES[activeDateObj.getMonth()]} ${activeDateObj.getFullYear()}`;
  }, [activeDateObj]);

  // Generate days window centered on activeDate
  const days = useMemo(() => generateDaysAroundDate(activeDate), [activeDate]);

  // Scroll to active date when days array changes
  useEffect(() => {
    const activeIndex = days.findIndex((d) => d.dateStr === activeDate);
    if (activeIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }, 50);
    }
  }, [activeDate, days]);

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(activeDateObj);
    newDate.setMonth(newDate.getMonth() - 1);
    onSelectDate(getFormattedDate(newDate));
  }, [activeDateObj, onSelectDate]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(activeDateObj);
    newDate.setMonth(newDate.getMonth() + 1);
    onSelectDate(getFormattedDate(newDate));
  }, [activeDateObj, onSelectDate]);

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

  const handlePress = useCallback(
    (dateStr: string) => {
      onSelectDate(dateStr);
    },
    [onSelectDate]
  );

  const renderItem = useCallback(
    ({ item }: { item: DayItem }) => {
      const isActive = item.dateStr === activeDate;

      return (
        <Pressable
          onPress={() => handlePress(item.dateStr)}
          style={({ pressed }) => [
            styles.dayItem,
            isActive && styles.dayItemActive,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.weekdayText, isActive && styles.weekdayTextActive]}>
            {item.weekday}
          </Text>
          <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]}>
            {item.dayNumber}
          </Text>
        </Pressable>
      );
    },
    [activeDate, handlePress]
  );

  const keyExtractor = useCallback((item: DayItem) => item.dateStr, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<DayItem> | null | undefined, index: number) => ({
      length: DAY_SELECTOR_CONSTANTS.itemWidth,
      offset: DAY_SELECTOR_CONSTANTS.itemWidth * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {/* Month/Year Header */}
      <View style={styles.headerRow}>
        <Pressable
          style={({ pressed }) => [styles.chevronButton, pressed && { opacity: 0.7 }]}
          onPress={handlePrevMonth}
        >
          <ChevronLeft size={24} color={colors.textSecondary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => pressed && { opacity: 0.7 }}
          onPress={handleMonthYearPress}
        >
          <Text style={styles.monthYearText}>{monthYearLabel}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.chevronButton, pressed && { opacity: 0.7 }]}
          onPress={handleNextMonth}
        >
          <ChevronRight size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={() => {}}
      />

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
