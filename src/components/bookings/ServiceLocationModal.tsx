import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, CurrentLocationIcon, MapPinIcon, SearchIcon } from '../icons';
import {
  autocompleteAddress,
  newSessionToken,
  resolvePlace,
  type AddressPrediction,
} from '../../services/geocoding';

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

/** A chosen service location; coordinates are present when geocoded. */
export type SelectedLocation = Readonly<{
  address: string;
  latitude: number | null;
  longitude: number | null;
}>;

type ServiceLocationModalProps = Readonly<{
  visible: boolean;
  initialValue?: string;
  onClose: () => void;
  onSelect: (location: SelectedLocation) => void;
  /** Capture the device's GPS position as the service location. */
  onUseCurrentLocation: () => void;
}>;

export function ServiceLocationModal({
  visible,
  initialValue,
  onClose,
  onSelect,
  onUseCurrentLocation,
}: ServiceLocationModalProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(initialValue ?? '');
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [isSearching, setSearching] = useState(false);
  const [isResolving, setResolving] = useState(false);
  const sessionToken = useRef(newSessionToken());

  useEffect(() => {
    if (visible) {
      setQuery(initialValue ?? '');
      setPredictions([]);
      sessionToken.current = newSessionToken();
    }
  }, [initialValue, visible]);

  // Debounced address autocomplete (Google Places via our backend).
  useEffect(() => {
    const trimmed = query.trim();
    if (!visible || trimmed.length < 3) {
      setPredictions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const handle = setTimeout(async () => {
      try {
        const results = await autocompleteAddress(trimmed, sessionToken.current);
        if (!cancelled) {
          setPredictions(results);
        }
      } catch {
        if (!cancelled) {
          setPredictions([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, visible]);

  const selectPrediction = async (prediction: AddressPrediction) => {
    if (isResolving) {
      return;
    }
    setResolving(true);
    try {
      const place = await resolvePlace(prediction.placeId, sessionToken.current);
      onSelect({
        address: place.address || prediction.description,
        latitude: place.latitude,
        longitude: place.longitude,
      });
    } catch {
      // Keep the chosen text even if coordinates couldn't be resolved.
      onSelect({
        address: prediction.description,
        latitude: null,
        longitude: null,
      });
    } finally {
      setResolving(false);
      // A session ends once details are fetched; start a fresh one.
      sessionToken.current = newSessionToken();
    }
  };

  // "Use this address": prefer the top match (with coordinates); otherwise keep
  // the typed text without coordinates.
  const confirm = async () => {
    const trimmed = query.trim();
    if (trimmed.length === 0 || isResolving) {
      return;
    }
    if (predictions.length > 0) {
      await selectPrediction(predictions[0]);
      return;
    }
    onSelect({ address: trimmed, latitude: null, longitude: null });
  };

  const showPredictions = query.trim().length >= 3;

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
              returnKeyType="search"
              onSubmitEditing={confirm}
              style={styles.searchInput}
              value={query}
            />
            {isSearching ? <ActivityIndicator color={MUTED} size="small" /> : null}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onUseCurrentLocation}
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

          {showPredictions ? (
            <>
              <Text style={styles.sectionLabel}>Suggestions</Text>
              {!isSearching && predictions.length === 0 ? (
                <Text style={styles.empty}>No matching addresses.</Text>
              ) : null}
              <ScrollView
                keyboardShouldPersistTaps="handled"
                style={styles.results}>
                {predictions.map(prediction => (
                  <Pressable
                    accessibilityRole="button"
                    key={prediction.placeId}
                    onPress={() => selectPrediction(prediction)}
                    style={({ pressed }) => [
                      styles.recentRow,
                      pressed && styles.pressed,
                    ]}>
                    <MapPinIcon color={MUTED} size={16} />
                    <Text numberOfLines={2} style={styles.recentLabel}>
                      {prediction.description}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Recent locations</Text>
              {RECENT_LOCATIONS.map(location => (
                <Pressable
                  accessibilityRole="button"
                  key={location}
                  onPress={() => setQuery(location)}
                  style={({ pressed }) => [
                    styles.recentRow,
                    pressed && styles.pressed,
                  ]}>
                  <MapPinIcon color={MUTED} size={16} />
                  <Text numberOfLines={1} style={styles.recentLabel}>
                    {location}
                  </Text>
                </Pressable>
              ))}
            </>
          )}

          <View style={styles.divider} />

          <Pressable
            accessibilityRole="button"
            disabled={query.trim().length === 0 || isResolving}
            onPress={confirm}
            style={({ pressed }) => [
              styles.confirm,
              (query.trim().length === 0 || isResolving) && styles.confirmDisabled,
              pressed && styles.pressed,
            ]}>
            {isResolving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmLabel}>Use this address</Text>
            )}
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
  empty: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: 8,
  },
  results: {
    maxHeight: 220,
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
