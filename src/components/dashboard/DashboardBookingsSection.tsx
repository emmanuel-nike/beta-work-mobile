import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import DashboardBookingsEmptyArtwork from '../../../assets/images/dashboard-bookings-empty.svg';
import type { Booking } from '../../data/bookings';
import { STATUS_LABELS, STATUS_SOFT_COLORS } from '../../theme/bookings';
import { dashboardColors } from '../../theme/dashboard';

const CARD_WIDTH = 165;

type DashboardBookingsSectionProps = Readonly<{
  bookings: readonly Booking[];
  onSeeAll: () => void;
  onSelectBooking: (booking: Booking) => void;
  onBookService: () => void;
}>;

export function DashboardBookingsSection({
  bookings,
  onSeeAll,
  onSelectBooking,
  onBookService,
}: DashboardBookingsSectionProps) {
  if (bookings.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Your bookings will live here</Text>
        <View style={styles.emptyCard}>
          <DashboardBookingsEmptyArtwork height={103} width={132} />
          <Text style={styles.emptyCopy}>
            Ready to get something done?{'\n'}Book your first service.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onBookService}
            style={({ pressed }) => [
              styles.pill,
              styles.emptyButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.pillLabel}>Book a service</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bookings</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
        >
          <Text style={styles.pillLabel}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.row}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {bookings.map(booking => (
          <BookingPreviewCard
            booking={booking}
            key={booking.id}
            onPress={onSelectBooking}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/** "₦40,000" reads as "₦40k" in the compact dashboard card. */
function toCompactAmount(budget: string): string {
  const digits = budget.replace(/[^\d]/g, '');
  if (digits.length === 0) {
    return budget;
  }

  const amount = Number(digits);
  const symbol = budget.trim().charAt(0);
  return amount >= 1000
    ? `${symbol}${Math.round(amount / 1000)}k`
    : `${symbol}${amount}`;
}

function BookingPreviewCard({
  booking,
  onPress,
}: Readonly<{ booking: Booking; onPress: (booking: Booking) => void }>) {
  const badge = STATUS_SOFT_COLORS[booking.status];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(booking)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrapper}>
        <Image source={booking.avatar} style={styles.image} />
        <View style={[styles.badge, { backgroundColor: badge.background }]}>
          <Text style={[styles.badgeLabel, { color: badge.text }]}>
            {STATUS_LABELS[booking.status]}
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {booking.artisanName}
      </Text>
      <Text numberOfLines={1} style={styles.meta}>
        {booking.trade}, {toCompactAmount(booking.budget)}
      </Text>
      <Text numberOfLines={1} style={styles.schedule}>
        {booking.dateTime.replace(' • ', ', ')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.09)',
    borderRadius: 18.5,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pillLabel: {
    color: dashboardColors.tabBar,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  scroll: {
    marginRight: -24,
  },
  row: {
    gap: 12,
    paddingRight: 24,
  },
  card: {
    width: CARD_WIDTH,
  },
  imageWrapper: {
    borderRadius: 16,
    height: 150,
    marginBottom: 10,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badge: {
    alignItems: 'center',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    right: 12,
    top: 12,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  name: {
    color: '#1F1611',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  meta: {
    color: '#3D2E22',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  schedule: {
    color: '#6B3F26',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#F4E9DA',
    borderRadius: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 19,
  },
  emptyCopy: {
    color: '#1F1611',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyButton: {
    height: 37,
    marginTop: 18,
    paddingHorizontal: 20,
  },
});
