import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  type ArtisanJob,
} from '../../data/artisanJobs';
import { dashboardColors } from '../../theme/dashboard';

type ArtisanJobCardProps = Readonly<{
  job: ArtisanJob;
  onViewDetails: (job: ArtisanJob) => void;
}>;

export function ArtisanJobCard({ job, onViewDetails }: ArtisanJobCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={job.avatar} style={styles.avatar} />
        <View style={styles.identity}>
          <Text style={styles.trade}>{job.trade}</Text>
          <Text style={styles.name}>{job.clientName}</Text>
          <Text style={styles.distance}>{job.distance}</Text>
        </View>
        <View
          style={[styles.badge, { backgroundColor: JOB_STATUS_COLORS[job.status] }]}
        >
          <Text style={styles.badgeLabel}>{JOB_STATUS_LABELS[job.status]}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <DetailLine label="Date & Time:" value={job.dateTime} />
        <DetailLine label="Location:" value={job.location} />
        <DetailLine label="Service:" value={job.service} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onViewDetails(job)}
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
  badge: {
    alignItems: 'center',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeLabel: {
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
