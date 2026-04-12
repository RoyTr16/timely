import { Tabs } from 'expo-router';

import { Calendar, Inbox } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../../types/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: spacing.xxl + spacing.sm + insets.bottom, // 64px + safe area
          paddingBottom: insets.bottom + spacing.xs,
          paddingTop: spacing.xs,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="backlog"
        options={{
          tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
