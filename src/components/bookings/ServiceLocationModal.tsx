import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, CurrentLocationIcon, MapPinIcon, SearchIcon } from '../icons';

const SURFACE = '#FBF6EC';
const FIELD_BORDER = '#A99F8E';
const DIVIDER = '#E5DAC6';
const TITLE = '#1F1611';
const ADDRESS = '#1B1105';
const MUTED = '#736051';
const ACCENT = '#0F6743';

const RECENT_LOCATIONS = [
  '145 Adetokunbo Ademola Crescent, Wuse 2',
  'Jabi Lake Mall, Jabi, Abuja',
  'Wuse Market, Wuse 2, Abuja',
];

/** The current device location, stubbed until geolocation is wired up. */
const CURRENT_LOCATION = 'Current location, Abuja';

type ServiceLocationModalProps = Readonly<{
  visible: boolean;
  initialValue?: string;
  onClose: () => void;
  onSelect: (location: string) => void;
}>;

export function ServiceLocationModal({
  visible,
  initialValue,
  onClose,
  onSelect,
}: ServiceLocationModalProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(initialValue ?? '');

  useEffect(() => {
    if (visible) {
      setQuery(initialValue ?? '');
    }
  }, [initialValue, visible]);

  const confirm = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return;
    }
    onSelect(trimmed);
  };

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

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Add service location</Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <CloseIcon color="#1F1611" size={14} />
            </Pressable>
          </View>

          <View style={styles.searchField}>
            <SearchIcon color={MUTED} size={18} />
            <TextInput
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search or enter address"
              placeholderTextColor={MUTED}
              returnKeyType="done"
              onSubmitEditing={() => confirm(query)}
              style={styles.searchInput}
              value={query}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => confirm(CURRENT_LOCATION)}
            style={({ pressed }) => [
              styles.currentLocation,
              pressed && styles.pressed,
            ]}>
            <CurrentLocationIcon color={ACCENT} size={18} />
            <Text style={styles.currentLocationLabel}>
              Use your current location
            </Text>
          </Pressable>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Recent locations</Text>
          {RECENT_LOCATIONS.map(location => (
            <Pressable
              accessibilityRole="button"
              key={location}
              onPress={() => setQuery(location)}
              style={({ pressed }) => [styles.recentRow, pressed && styles.pressed]}>
              <MapPinIcon color={MUTED} size={16} />
              <Text numberOfLines={1} style={styles.recentLabel}>
                {location}
              </Text>
            </Pressable>
          ))}

          <View style={styles.divider} />

          <Pressable
            accessibilityRole="button"
            disabled={query.trim().length === 0}
            onPress={() => confirm(query)}
            style={({ pressed }) => [
              styles.confirm,
              query.trim().length === 0 && styles.confirmDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.confirmLabel}>Use this location</Text>
          </Pressable>
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
    backgroundColor: 'rgba(24, 16, 8, 0.45)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
  searchField: {
    alignItems: 'center',
    borderColor: FIELD_BORDER,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 10,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: ADDRESS,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  currentLocation: {
    alignItems: 'center',
    backgroundColor: '#E4EDE7',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    height: 50,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  currentLocationLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  divider: {
    backgroundColor: DIVIDER,
    height: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },
  sectionLabel: {
    color: TITLE,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  recentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  recentLabel: {
    color: ADDRESS,
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  confirm: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
  },
  confirmDisabled: {
    opacity: 0.5,
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
