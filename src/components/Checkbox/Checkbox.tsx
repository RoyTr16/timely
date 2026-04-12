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

import { colors, timing } from '../../types/theme';
import { styles, CHECKBOX_CONSTANTS } from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
}

export function Checkbox({ isChecked, onToggle }: CheckboxProps) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isChecked ? 1 : 0);

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

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHECKBOX_CONSTANTS.uncheckedBackground, CHECKBOX_CONSTANTS.checkedBackground]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHECKBOX_CONSTANTS.uncheckedBorder, CHECKBOX_CONSTANTS.checkedBorder]
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
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
