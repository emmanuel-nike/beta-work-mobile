import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import ArrowIcon from '../../assets/images/arrow.svg';
import { colors } from '../theme/colors';

type ActionButtonProps = Readonly<{
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'outlined';
  large?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function ActionButton({
  children,
  onPress,
  variant = 'primary',
  large = false,
  disabled = false,
  style,
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        large && styles.large,
        isPrimary ? styles.primary : styles.outlined,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.label, !isPrimary && styles.outlinedLabel]}>
        {children}
      </Text>
      {isPrimary ? (
        <ArrowIcon
          color={colors.white}
          height={large ? 24 : 20}
          width={large ? 24 : 20}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  large: {
    height: 56,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outlined: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
  },
  outlinedLabel: {
    color: colors.primary,
  },
});
