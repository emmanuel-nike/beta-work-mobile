import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookingsEmptyArtwork from '../../../assets/images/bookings-empty.svg';
import { BookingButton } from '../../components/bookings/BookingButton';
import { BookingCard } from '../../components/bookings/BookingCard';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import {
  BOOKINGS,
  BOOKING_FILTERS,
  filterBookings,
  type Booking,
  type BookingFilter,
} from '../../data/bookings';
import {
  useAuthNavigation,
  useClientTabNavigation,
} from '../../navigation/types';
import { bookingColors } from '../../theme/bookings';

export function BookingsListScreen() {
  const insets = useSafeAreaInsets();
  const authNavigation = useAuthNavigation();
  const tabNavigation = useClientTabNavigation();
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');

  const bookings = useMemo(
    () => filterBookings(BOOKINGS, activeFilter),
    [activeFilter],
  );

  const openBooking = (booking: Booking) =>
    authNavigation.navigate('BookingDetails', { bookingId: booking.id });

  return (
    <View style={styles.root}>
      <BookingsHeader title="My Bookings" />

      <ScrollView
        contentContainerStyle={styles.filterRow}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {BOOKING_FILTERS.map(filter => {
          const isActive = filter.id === activeFilter;

          return (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => setActiveFilter(filter.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {bookings.length === 0 ? (
        <EmptyState onFindArtisans={() => tabNavigation.navigate('home')} />
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          data={bookings}
          keyExtractor={booking => booking.id}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={openBooking} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function EmptyState({
  onFindArtisans,
}: Readonly<{ onFindArtisans: () => void }>) {
  return (
    <View style={styles.empty}>
      <BookingsEmptyArtwork height={260} width={260} />
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyBody}>
        You currently have no active service requests. Find a verified
        professional near you!
      </Text>
      <BookingButton
        compact
        onPress={onFindArtisans}
        style={styles.emptyButton}
      >
        Find artisans
      </BookingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: bookingColors.surface,
    flex: 1,
  },
  filterScroll: {
    flexGrow: 0,
    paddingVertical: 24,
    marginBottom: 12,
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 24,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: bookingColors.chipInactive,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  chipActive: {
    backgroundColor: bookingColors.primary,
  },
  chipLabel: {
    color: bookingColors.textMuted,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  chipLabelActive: {
    color: bookingColors.white,
    fontWeight: '600',
  },
  listContent: {
    gap: 12,
    paddingHorizontal: 24,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: bookingColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 4,
  },
  emptyBody: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    width: 240,
  },
});
