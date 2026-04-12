import { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';

import { colors } from '../../types/theme';
import { getFormattedDate } from '../../utils';
import { GlassCard } from '../GlassCard';
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

function generateDays(): DayItem[] {
  const days: DayItem[] = [];
  const today = new Date();

  // Generate past days + today + future days
  for (let i = -DAY_SELECTOR_CONSTANTS.pastDays; i <= DAY_SELECTOR_CONSTANTS.futureDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

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
  const days = useMemo(() => generateDays(), []);

  // Scroll to active date on mount
  useEffect(() => {
    const activeIndex = days.findIndex((d) => d.dateStr === activeDate);
    if (activeIndex !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: activeIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [activeDate, days]);

  const handlePress = useCallback(
    (dateStr: string) => {
      onSelectDate(dateStr);
    },
    [onSelectDate]
  );

  const renderItem = useCallback(
    ({ item }: { item: DayItem }) => {
      const isActive = item.dateStr === activeDate;

      const content = (
        <View style={[styles.dayItem, isActive && styles.dayItemActive]}>
          <Text style={[styles.weekdayText, isActive && styles.weekdayTextActive]}>
            {item.weekday}
          </Text>
          <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]}>
            {item.dayNumber}
          </Text>
        </View>
      );

      if (isActive) {
        return (
          <Pressable onPress={() => handlePress(item.dateStr)}>
            <GlassCard tintColor={colors.accent}>{content}</GlassCard>
          </Pressable>
        );
      }

      return (
        <Pressable
          onPress={() => handlePress(item.dateStr)}
          style={({ pressed }) => pressed && { opacity: 0.7 }}
        >
          {content}
        </Pressable>
      );
    },
    [activeDate, handlePress]
  );

  const keyExtractor = useCallback((item: DayItem) => item.dateStr, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<DayItem> | null | undefined, index: number) => ({
      length: 64,
      offset: 64 * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
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
    </View>
  );
}
