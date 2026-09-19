import type { ComponentType } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../theme/clientApp';
import { ChevronRightIcon, CloseIcon, type SizedIconProps } from '../icons';

const SHEET_PADDING = 16;
const ROW_HEIGHT = 56;
const ICON_SIZE = 20;

/** Destructive rows use the sheet's own red rather than the app-wide danger tone. */
const DESTRUCTIVE = '#D32F2F';
const LABEL = '#3A281A';
const GLYPH = '#4A3A2C';

export type ActionSheetOption = Readonly<{
  id: string;
  label: string;
  Icon: ComponentType<SizedIconProps>;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}>;

type ActionSheetProps = Readonly<{
  visible: boolean;
  title: string;
  options: readonly ActionSheetOption[];
  onClose: () => void;
}>;

/**
 * Bottom sheet styled after the Photo Action Sheet design: a titled header with
 * a close affordance, then full-width rows separated by hairline dividers.
 */
export function ActionSheet({
  visible,
  title,
  options,
  onClose,
}: ActionSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={12}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <CloseIcon color={GLYPH} size={16} />
            </Pressable>
          </View>

          {options.map(option => (
            <ActionSheetRow key={option.id} option={option} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

function ActionSheetRow({ option }: Readonly<{ option: ActionSheetOption }>) {
  const {
    Icon,
    label,
    onPress,
    destructive = false,
    disabled = false,
  } = option;
  const tint = destructive ? DESTRUCTIVE : GLYPH;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.rowDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Icon color={disabled ? appColors.textFaint : tint} size={ICON_SIZE} />
      <Text
        style={[
          styles.label,
          destructive && styles.labelDestructive,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
      <ChevronRightIcon
        color={disabled ? appColors.textFaint : GLYPH}
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 16, 8, 0.28)',
  },
  sheet: {
    backgroundColor: appColors.field,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SHEET_PADDING,
  },
  header: {
    alignItems: 'center',
    height: ROW_HEIGHT,
    justifyContent: 'center',
  },
  title: {
    color: LABEL,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  close: {
    position: 'absolute',
    right: 0,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: appColors.cardBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    height: ROW_HEIGHT,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  label: {
    color: LABEL,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  labelDestructive: {
    color: DESTRUCTIVE,
  },
  labelDisabled: {
    color: appColors.textFaint,
  },
  pressed: {
    opacity: 0.6,
  },
});
