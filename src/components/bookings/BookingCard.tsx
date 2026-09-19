import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Booking } from '../../data/bookings';
import { bookingColors } from '../../theme/bookings';
import { StarIcon } from '../icons';
import { StatusBadge } from './StatusBadge';

type BookingCardProps = Readonly<{
  booking: Booking;
  onPress: (booking: Booking) => void;
}>;

export function BookingCard({ booking, onPress }: BookingCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(booking)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <Image source={booking.avatar} style={styles.avatar} />
        <View style={styles.identity}>
          <Text numberOfLines={1} style={styles.name}>
            {booking.artisanName}
          </Text>
          <Text numberOfLines={1} style={styles.trade}>
            {booking.trade}
          </Text>
          <View style={styles.ratingRow}>
            <StarIcon />
            <Text style={styles.rating}>{booking.rating}</Text>
            <Text style={styles.distance}>{booking.distance}</Text>
          </View>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.details}>
        <DetailLine label="Date & Time:" value={booking.dateTime} />
        <DetailLine label="Location:" value={booking.location} />
        <DetailLine label="Service:" value={booking.service} />
      </View>
    </Pressable>
  );
}

function DetailLine({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Text numberOfLines={1} style={styles.detailValue}>
      <Text style={styles.detailLabel}>{label} </Text>
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: bookingColors.card,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  top: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 4,
    height: 56,
    width: 56,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: bookingColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  trade: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    color: bookingColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
  },
  distance: {
    color: bookingColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 4,
  },
  details: {
    gap: 8,
  },
  detailLabel: {
    color: bookingColors.textLabel,
    fontWeight: '700',
  },
  detailValue: {
    color: bookingColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
  },
});
