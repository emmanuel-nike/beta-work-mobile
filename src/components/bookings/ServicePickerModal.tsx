import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SERVICE_OPTIONS } from '../../data/bookingDraft';
import { CheckIcon, CloseIcon } from '../icons';

const SURFACE = '#FBF6EC';
const TITLE = '#1F1611';
const LABEL = '#3D2E22';
const DIVIDER = '#E5DAC6';
const ACCENT = '#0F6743';

type ServicePickerModalProps = Readonly<{
  visible: boolean;
  selectedId: string | null;
  onClose: () => void;
  onSelect: (service: { id: string; label: string }) => void;
}>;

export function ServicePickerModal({
  visible,
  selectedId,
  onClose,
  onSelect,
}: ServicePickerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Select service</Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <CloseIcon color="#1F1611" size={14} />
            </Pressable>
          </View>

          <FlatList
            data={SERVICE_OPTIONS}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={Separator}
            renderItem={({ item }) => {
              const selected = item.id === selectedId;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                  <Text
                    style={[styles.rowLabel, selected && styles.rowLabelSelected]}>
                    {item.label}
                  </Text>
                  {selected ? <CheckIcon color={ACCENT} size={18} /> : null}
                </Pressable>
              );
            }}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
}

function Separator() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 16, 8, 0.45)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: '#E8E6E1',
    borderRadius: 3,
    height: 6,
    width: 56,
  },
  header: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
  },
  title: {
    color: TITLE,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  close: {
    alignItems: 'center',
    backgroundColor: '#F1E7D6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 40,
  },
  list: {
    marginTop: 4,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  rowLabel: {
    color: LABEL,
    fontSize: 15,
    lineHeight: 20,
  },
  rowLabelSelected: {
    color: ACCENT,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: DIVIDER,
    height: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.6,
  },
});
