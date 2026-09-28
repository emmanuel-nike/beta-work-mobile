import { StyleSheet, Text, View } from 'react-native';

import { LockIcon } from '../icons';
import { dashboardColors } from '../../theme/dashboard';

export function ProfileReviewCard() {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.iconWrap}>
        <LockIcon color={dashboardColors.accentGold} size={18} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Your profile is under review</Text>
        <Text style={styles.body}>
          Verification usually takes 24–48 hours.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    padding: 16,
    paddingLeft: 20,
  },
  accent: {
    backgroundColor: dashboardColors.accentGold,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 6,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(229, 161, 31, 0.16)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copy: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  body: {
    color: dashboardColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
