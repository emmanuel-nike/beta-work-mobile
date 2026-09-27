import type { ComponentType, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SizedIconProps } from '../icons';
import { dashboardColors } from '../../theme/dashboard';

type ArtisanStatCardProps = Readonly<{
  Icon: ComponentType<SizedIconProps> | ReactNode;
  label: string;
  value: string;
  sublabel: string;
}>;

export function ArtisanStatCard({
  Icon,
  label,
  value,
  sublabel,
}: ArtisanStatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {typeof Icon === 'function' ? (
          <Icon color={dashboardColors.star} size={20} />
        ) : (
          Icon
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderRadius: 10,
    flex: 1,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    alignItems: 'flex-start',
    //flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: dashboardColors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  value: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    marginTop: 2,
  },
  sublabel: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 15,
  },
});
