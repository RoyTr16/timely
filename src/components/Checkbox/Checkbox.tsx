import { useCallback, useEffect } from 'react';
import { Pressable } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors, timing } from '../../types/theme';
import { styles, CHECKBOX_CONSTANTS } from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  color?: string;
}

export function Checkbox({ isChecked, onToggle, color }: CheckboxProps) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isChecked ? 1 : 0);
  const checkedColor = color ?? CHECKBOX_CONSTANTS.checkedBackground;

  // Sync progress with isChecked prop changes
  useEffect(() => {
    progress.value = withTiming(isChecked ? 1 : 0, { duration: timing.normal });
  }, [isChecked, progress]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  }, [onToggle]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHECKBOX_CONSTANTS.uncheckedBackground, checkedColor]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHECKBOX_CONSTANTS.uncheckedBorder, checkedColor]
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <AnimatedPressable
      onPress={handleToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, containerAnimatedStyle]}
    >
      <Animated.View style={[styles.icon, iconAnimatedStyle]}>
        <Check
          size={CHECKBOX_CONSTANTS.iconSize}
          color={colors.textPrimary}
          strokeWidth={3}
        />
      </Animated.View>
    </AnimatedPressable>
  );
}
