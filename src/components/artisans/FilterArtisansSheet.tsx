import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RangeSlider, type Range } from '../common/RangeSlider';
import { CloseIcon } from '../icons';

export type ArtisanSort = 'top-rated' | 'nearest' | 'lowest-price';
export type RatingFloor = 0 | 4 | 4.5;

export type ArtisanFilters = Readonly<{
  sort: ArtisanSort;
  minRating: RatingFloor;
  distance: Range;
  price: Range;
}>;

export const DISTANCE_BOUNDS: Range = { min: 0, max: 20 };
export const PRICE_BOUNDS: Range = { min: 1000, max: 100000 };

export const DEFAULT_ARTISAN_FILTERS: ArtisanFilters = {
  sort: 'top-rated',
  minRating: 0,
  distance: DISTANCE_BOUNDS,
  price: PRICE_BOUNDS,
};

const SORTS: ReadonlyArray<{ id: ArtisanSort; label: string }> = [
  { id: 'top-rated', label: 'Top rated' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'lowest-price', label: 'Lowest price' },
];

const RATINGS: ReadonlyArray<{ id: RatingFloor; label: string }> = [
  { id: 0, label: 'Any' },
  { id: 4, label: '4.0+' },
  { id: 4.5, label: '4.5+' },
];

const SURFACE = '#FDFAF3';
const ACCENT = '#0F6743';
const BORDER = '#A99F8E';
const LABEL = '#3D2E22';
const MUTED = '#B0A08F';

type FilterArtisansSheetProps = Readonly<{
  visible: boolean;
  filters: ArtisanFilters;
  onClose: () => void;
  onApply: (filters: ArtisanFilters) => void;
}>;

export function FilterArtisansSheet({
  visible,
  filters,
  onClose,
  onApply,
}: FilterArtisansSheetProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(filters);

  // Reopening the sheet should show what is currently applied.
  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [filters, visible]);

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
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>Filter artisans</Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <CloseIcon color="#1F1611" size={14} />
            </Pressable>
          </View>

          <Text style={styles.groupLabel}>Sort by</Text>
          <View style={styles.optionRow}>
            {SORTS.map(option => (
              <RadioPill
                key={option.id}
                label={option.label}
                onPress={() =>
                  setDraft(current => ({ ...current, sort: option.id }))
                }
                selected={draft.sort === option.id}
              />
            ))}
          </View>

          <Text style={styles.groupLabel}>Rating</Text>
          <View style={styles.optionRow}>
            {RATINGS.map(option => (
              <RadioPill
                key={option.label}
                label={option.label}
                onPress={() =>
                  setDraft(current => ({ ...current, minRating: option.id }))
                }
                selected={draft.minRating === option.id}
              />
            ))}
          </View>

          <Text style={styles.groupLabel}>Distance (km)</Text>
          <RangeSlider
            bounds={DISTANCE_BOUNDS}
            onChange={distance =>
              setDraft(current => ({ ...current, distance }))
            }
            value={draft.distance}
          />
          <View style={styles.scaleRow}>
            <Text style={styles.scaleLabel}>{draft.distance.min}km</Text>
            <Text style={styles.scaleLabel}>
              {draft.distance.max}
              {draft.distance.max >= DISTANCE_BOUNDS.max ? '+' : ''} km
            </Text>
          </View>

          <Text style={styles.groupLabel}>Price range (₦)</Text>
          <RangeSlider
            bounds={PRICE_BOUNDS}
            onChange={price => setDraft(current => ({ ...current, price }))}
            step={1000}
            value={draft.price}
          />
          <View style={styles.scaleRow}>
            <Text style={styles.scaleLabel}>
              ₦{draft.price.min.toLocaleString('en-NG')}
            </Text>
            <Text style={styles.scaleLabel}>
              ₦{draft.price.max.toLocaleString('en-NG')}
              {draft.price.max >= PRICE_BOUNDS.max ? '+' : ''}
            </Text>
          </View>

          <View style={styles.divider} />

          <Pressable
            accessibilityRole="button"
            onPress={() => onApply(draft)}
            style={({ pressed }) => [styles.apply, pressed && styles.pressed]}
          >
            <Text style={styles.applyLabel}>Apply filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function RadioPill({
  label,
  selected,
  onPress,
}: Readonly<{ label: string; selected: boolean; onPress: () => void }>) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.pillSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text style={styles.pillLabel}>{label}</Text>
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
    backgroundColor: 'rgba(24, 16, 8, 0.45)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
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
    height: 40,
    justifyContent: 'center',
    marginTop: 4,
  },
  title: {
    color: '#1F1611',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  close: {
    alignItems: 'center',
    backgroundColor: '#F7F1E6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 40,
  },
  groupLabel: {
    color: LABEL,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    marginTop: 22,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 41,
    paddingHorizontal: 12,
  },
  pillSelected: {
    backgroundColor: '#E4EDE7',
    borderColor: ACCENT,
  },
  pillLabel: {
    color: LABEL,
    fontSize: 13,
    lineHeight: 18,
  },
  radio: {
    alignItems: 'center',
    borderColor: MUTED,
    borderRadius: 7,
    borderWidth: 1.5,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  radioSelected: {
    borderColor: ACCENT,
  },
  radioDot: {
    backgroundColor: ACCENT,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  scaleLabel: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    backgroundColor: '#E5E7EB',
    height: StyleSheet.hairlineWidth,
    marginHorizontal: -24,
    marginTop: 24,
  },
  apply: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 6,
    height: 48,
    justifyContent: 'center',
    marginTop: 20,
  },
  applyLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
