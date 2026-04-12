import { StyleSheet, View, ViewProps } from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing, glass } from '../../types/theme';

interface GlassCardProps extends ViewProps {
  /** Category color for tinting the glass */
  tintColor?: string;
  /** Blur intensity: 'subtle' | 'heavy' */
  intensity?: 'subtle' | 'heavy';
  children: React.ReactNode;
}

const BORDER_RADIUS = spacing.md;
const BORDER_WIDTH = 1;

/**
 * GlassCard - Premium glassmorphism container
 * Uses BlurView for frosted effect with category-based tinting
 */
export function GlassCard({
  tintColor,
  intensity = 'subtle',
  children,
  style,
  ...props
}: GlassCardProps) {
  const blurIntensity = glass.blurIntensity[intensity];

  return (
    <View style={[styles.wrapper, style]} {...props}>
      {/* Gradient border */}
      <LinearGradient
        colors={glass.borderGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGradient}
      />

      {/* Blur layer */}
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={styles.blur}
      >
        {/* Category tint overlay */}
        {tintColor != null && (
          <View
            style={[
              styles.tintOverlay,
              { backgroundColor: tintColor },
            ]}
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  borderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS,
  },
  blur: {
    flex: 1,
    margin: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS - BORDER_WIDTH,
    overflow: 'hidden',
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    padding: spacing.sm,
  },
});
