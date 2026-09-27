import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { JobRequest } from '../../data/artisanRequests';
import { dashboardColors } from '../../theme/dashboard';

type JobRequestCardProps = Readonly<{
  request: JobRequest;
  onViewDetails: (request: JobRequest) => void;
}>;

export function JobRequestCard({ request, onViewDetails }: JobRequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={request.avatar} style={styles.avatar} />
        <View style={styles.identity}>
          <Text style={styles.trade}>{request.trade}</Text>
          <Text style={styles.name}>{request.clientName}</Text>
          <Text style={styles.distance}>{request.distance}</Text>
        </View>
        {request.status === 'pending' ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingLabel}>Pending</Text>
          </View>
        ) : (
          <Text style={styles.price}>{request.price}</Text>
        )}
      </View>

      <View style={styles.details}>
        <DetailLine label="Date & Time:" value={request.dateTime} />
        <DetailLine label="Location:" value={request.location} />
        <DetailLine label="Service:" value={request.service} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onViewDetails(request)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonLabel}>View details →</Text>
      </Pressable>
    </View>
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
    backgroundColor: dashboardColors.card,
    borderRadius: 8,
    gap: 12,
    padding: 16,
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
  trade: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  name: {
    color: dashboardColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  distance: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  price: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  pendingBadge: {
    alignItems: 'center',
    backgroundColor: '#E8976D',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pendingLabel: {
    color: dashboardColors.white,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  details: {
    gap: 8,
  },
  detailLabel: {
    color: dashboardColors.textLabel,
    fontWeight: '700',
  },
  detailValue: {
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
