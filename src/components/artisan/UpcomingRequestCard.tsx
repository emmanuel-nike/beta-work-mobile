import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { UpcomingRequest } from '../../data/artisanRequests';
import { dashboardColors } from '../../theme/dashboard';

type UpcomingRequestCardProps = Readonly<{
  request: UpcomingRequest;
  onViewDetails: (request: UpcomingRequest) => void;
}>;

export function UpcomingRequestCard({
  request,
  onViewDetails,
}: UpcomingRequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={request.avatar} style={styles.avatar} />
        <View style={styles.identity}>
          <View style={styles.tradeRow}>
            <Text style={styles.trade}>{request.trade}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.name}>{request.clientName}</Text>
          <Text style={styles.location}>{request.location}</Text>
          <Text style={styles.schedule}>{request.schedule}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onViewDetails(request)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonLabel}>View details</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderRadius: 8,
    gap: 14,
    padding: 16,
  },
  top: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 8,
    height: 76,
    width: 76,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  tradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trade: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 200, 0.16)',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeLabel: {
    color: '#2F6FB0',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  name: {
    color: dashboardColors.textLabel,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  location: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  schedule: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.1)',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
  },
  buttonLabel: {
    color: dashboardColors.tabBar,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
