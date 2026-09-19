import { StyleSheet, Text, View } from 'react-native';

import type { BookingStatus } from '../../data/bookings';
import { STATUS_COLORS, STATUS_LABELS, bookingColors } from '../../theme/bookings';

type StatusBadgeProps = Readonly<{
  status: BookingStatus;
}>;

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] }]}>
      <Text style={styles.label}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  label: {
    color: bookingColors.white,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
});
