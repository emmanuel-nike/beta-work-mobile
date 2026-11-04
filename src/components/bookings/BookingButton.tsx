import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { bookingColors } from '../../theme/bookings';

export type BookingButtonVariant = 'primary' | 'outlined' | 'warning';

type BookingButtonProps = Readonly<{
  children: string;
  onPress: () => void;
  variant?: BookingButtonVariant;
  disabled?: boolean;
  /** Compact height used for the in-card "Send message" action. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function BookingButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  compact = false,
  style,
}: BookingButtonProps) {
  const isPrimary = variant === 'primary';
  const accent =
    variant === 'warning' ? bookingColors.gold : bookingColors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        disabled
          ? styles.disabled
          : isPrimary
            ? { backgroundColor: accent }
            : { borderColor: accent, borderWidth: 1 },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: disabled
              ? bookingColors.disabledText
              : isPrimary
                ? bookingColors.white
                : accent,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 6,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  compact: {
    height: 48,
  },
  disabled: {
    backgroundColor: bookingColors.disabledSurface,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
