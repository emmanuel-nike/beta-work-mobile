import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../theme/clientApp';
import { CheckIcon, CloseIcon } from '../icons';

type SelectSheetProps = Readonly<{
  visible: boolean;
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}>;

/** Bottom-sheet single-select list used by the "Primary skill" dropdown. */
export function SelectSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: SelectSheetProps) {
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
              <CloseIcon color="#4A3A2C" size={16} />
            </Pressable>
          </View>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          >
            {options.map(option => {
              const isSelected = option === selected;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[styles.rowLabel, isSelected && styles.rowLabelActive]}
                  >
                    {option}
                  </Text>
                  {isSelected ? (
                    <CheckIcon color={appColors.primary} size={18} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    maxHeight: '70%',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  title: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  close: {
    position: 'absolute',
    right: 0,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: appColors.cardBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: appColors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  rowLabelActive: {
    color: appColors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
});
