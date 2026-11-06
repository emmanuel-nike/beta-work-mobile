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

import { saveAddress } from '../../api/addresses';
import type { AddressSelection } from '../../data/locations';
import { useRecentAddresses } from '../../hooks/useRecentAddresses';
import {
  autocompleteAddress,
  captureCurrentLocation,
  newSessionToken,
  resolvePlace,
  type AddressPrediction,
} from '../../services/geocoding';
import { CloseIcon, CurrentLocationIcon, MapPinIcon, SearchIcon } from '../icons';

const SURFACE = '#F7F1E6';
const FIELD = '#F5EDE2';
const FIELD_BORDER = '#A99F8E';
const DIVIDER = '#EDE1CC';
const TITLE = '#1F1611';
const ADDRESS = '#1B1105';
const SUBDUED = '#736051';
const ACCENT = '#0F6743';

type ChangeLocationModalProps = Readonly<{
  visible: boolean;
  onClose: () => void;
  onSelect: (location: AddressSelection) => void;
}>;

export function ChangeLocationModal({
  visible,
  onClose,
  onSelect,
}: ChangeLocationModalProps) {
  const insets = useSafeAreaInsets();
  const recent = useRecentAddresses(visible);
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<AddressPrediction[]>([]);
  const [isSearching, setSearching] = useState(false);
  const [isBusy, setBusy] = useState(false);
  const sessionToken = useRef(newSessionToken());

  useEffect(() => {
    if (visible) {
      setQuery('');
      setPredictions([]);
      setBusy(false);
      sessionToken.current = newSessionToken();
    }
  }, [visible]);

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

  // Persist the selection (best-effort) and hand it to the parent.
  const commit = (selection: AddressSelection) => {
    saveAddress(selection).catch(() => {});
    onSelect(selection);
  };

  const selectPrediction = async (prediction: AddressPrediction) => {
    if (isBusy) {
      return;
    }
    setBusy(true);
    try {
      const place = await resolvePlace(prediction.placeId, sessionToken.current);
      commit(place);
    } catch {
      setBusy(false);
    } finally {
      sessionToken.current = newSessionToken();
    }
  };

  const useCurrentLocation = async () => {
    if (isBusy) {
      return;
    }
    setBusy(true);
    try {
      commit(await captureCurrentLocation());
    } catch {
      setBusy(false);
    }
  };

  const showPredictions = query.trim().length >= 3;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}
    >
      <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>My location</Text>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onClose}
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <CloseIcon color={ADDRESS} size={14} />
          </Pressable>
        </View>

        <View style={styles.searchField}>
          <SearchIcon color={SUBDUED} size={18} />
          <TextInput
            autoCorrect={false}
            onChangeText={setQuery}
            placeholder="Enter a new address"
            placeholderTextColor={SUBDUED}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {isSearching ? <ActivityIndicator color={SUBDUED} size="small" /> : null}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={useCurrentLocation}
          style={({ pressed }) => [styles.currentRow, pressed && styles.pressed]}
        >
          {isBusy ? <ActivityIndicator color={ACCENT} size="small" /> : <CurrentLocationIcon />}
          <Text style={styles.currentLabel}>Use your current location</Text>
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          {showPredictions ? 'Address suggestions' : 'Recent addresses'}
        </Text>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {showPredictions ? (
            <>
              {predictions.map(prediction => (
                <Pressable
                  accessibilityRole="button"
                  key={prediction.placeId}
                  onPress={() => selectPrediction(prediction)}
                  style={({ pressed }) => [styles.addressRow, pressed && styles.pressed]}
                >
                  <View style={styles.pin}>
                    <MapPinIcon />
                  </View>
                  <Text style={styles.addressText}>{prediction.description}</Text>
                </Pressable>
              ))}
              {!isSearching && predictions.length === 0 ? (
                <Text style={styles.noResults}>No addresses match “{query.trim()}”.</Text>
              ) : null}
            </>
          ) : recent.length === 0 ? (
            <Text style={styles.noResults}>No recent addresses yet.</Text>
          ) : (
            recent.map(address => (
              <Pressable
                accessibilityRole="button"
                key={address.id}
                onPress={() => commit(address)}
                style={({ pressed }) => [styles.addressRow, pressed && styles.pressed]}
              >
                <View style={styles.pin}>
                  <MapPinIcon />
                </View>
                <View style={styles.addressCopy}>
                  <Text style={styles.addressText}>{address.line1 || address.address}</Text>
                  <Text style={styles.areaText}>
                    {[address.city, address.state].filter(Boolean).join(', ')}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  title: {
    color: TITLE,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  close: {
    alignItems: 'center',
    backgroundColor: '#F4E9DA',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  searchField: {
    alignItems: 'center',
    backgroundColor: FIELD,
    borderColor: FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 10,
    height: 48,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: ADDRESS,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  currentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 16,
  },
  currentLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  divider: {
    backgroundColor: DIVIDER,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 2,
  },
  sectionTitle: {
    color: '#3D2E22',
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 14,
  },
  addressRow: {
    alignItems: 'flex-start',
    borderBottomColor: DIVIDER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  pin: {
    paddingTop: 1,
  },
  addressCopy: {
    flex: 1,
    gap: 4,
  },
  addressText: {
    color: ADDRESS,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  areaText: {
    color: SUBDUED,
    fontSize: 11,
    lineHeight: 15,
  },
  noResults: {
    color: SUBDUED,
    fontSize: 13,
    lineHeight: 19,
    paddingVertical: 20,
  },
  pressed: {
    opacity: 0.6,
  },
});
