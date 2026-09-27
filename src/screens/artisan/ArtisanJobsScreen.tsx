import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JobRequestCard } from '../../components/artisan/JobRequestCard';
import { UpcomingRequestCard } from '../../components/artisan/UpcomingRequestCard';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import {
  NEW_JOB_REQUESTS,
  UPCOMING_REQUESTS,
} from '../../data/artisanRequests';
import { dashboardColors } from '../../theme/dashboard';

type JobsTab = 'new' | 'upcoming';

const TABS: ReadonlyArray<{ id: JobsTab; label: string }> = [
  { id: 'new', label: 'New requests' },
  { id: 'upcoming', label: 'Upcoming' },
];

export function ArtisanJobsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<JobsTab>('new');

  return (
    <View style={styles.root}>
      <BookingsHeader title="My Jobs" />

      <View style={styles.tabRow}>
        {TABS.map(item => {
          const isActive = item.id === tab;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={item.id}
              onPress={() => setTab(item.id)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'new'
          ? NEW_JOB_REQUESTS.map(request => (
              <JobRequestCard
                key={request.id}
                onViewDetails={() => {}}
                request={request}
              />
            ))
          : UPCOMING_REQUESTS.map(request => (
              <UpcomingRequestCard
                key={request.id}
                onViewDetails={() => {}}
                request={request}
              />
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: dashboardColors.artisanSurface,
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#D8C7AD',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tabActive: {
    backgroundColor: dashboardColors.tabBar,
  },
  tabLabel: {
    color: dashboardColors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  tabLabelActive: {
    color: dashboardColors.white,
    fontWeight: '600',
  },
  content: {
    gap: 12,
    paddingHorizontal: 24,
  },
})
