import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DashboardBookingsEmptyArtwork from '../../../assets/images/dashboard-bookings-empty.svg';
import { ArtisanJobCard } from '../../components/artisan/ArtisanJobCard';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { BriefcaseIcon } from '../../components/icons';
import {
  ARTISAN_JOBS,
  JOB_FILTERS,
  JOB_STATUS_LABELS,
  filterJobs,
  type ArtisanJob,
  type JobFilter,
} from '../../data/artisanJobs';
import { useAuthNavigation } from '../../navigation/types';
import { useAppSelector } from '../../store/hooks';
import { selectIsArtisanVerified } from '../../store/slices/authSlice';
import { dashboardColors } from '../../theme/dashboard';

export function ArtisanJobsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useAuthNavigation();
  const isVerified = useAppSelector(selectIsArtisanVerified);
  const [filter, setFilter] = useState<JobFilter>('all');

  const jobs = useMemo(
    () => (isVerified ? filterJobs(ARTISAN_JOBS, filter) : []),
    [filter, isVerified],
  );
  const hasAnyJobs = isVerified && ARTISAN_JOBS.length > 0;

  const openJob = (job: ArtisanJob) =>
    navigation.navigate('ArtisanJobDetail', { jobId: job.id });

  return (
    <View style={styles.root}>
      <BookingsHeader title="My Jobs" />

      {hasAnyJobs && (
        <ScrollView
          contentContainerStyle={styles.chipRow}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          {JOB_FILTERS.map(item => {
            const isActive = item.id === filter;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={item.id}
                onPress={() => setFilter(item.id)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text
                  style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      <View style={{ flex: 1 }}>
        {!hasAnyJobs ? (
          <AllEmptyState />
        ) : jobs.length === 0 ? (
          <CategoryEmptyState filter={filter} />
        ) : (
          <FlatList
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: tabBarHeight + 24 },
            ]}
            data={jobs}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ArtisanJobCard job={item} onViewDetails={openJob} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

function AllEmptyState() {
  return (
    <View style={styles.allEmpty}>
      <View style={styles.illustrationCircle}>
        <DashboardBookingsEmptyArtwork height={150} width={192} />
      </View>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyBody}>
        You currently have no active service requests. Find a verified
        professional near you!
      </Text>
    </View>
  );
}

function CategoryEmptyState({ filter }: Readonly<{ filter: JobFilter }>) {
  const label =
    filter === 'all' ? 'jobs' : JOB_STATUS_LABELS[filter].toLowerCase();

  return (
    <View style={styles.categoryEmptyWrap}>
      <View style={styles.categoryEmptyCard}>
        <View style={styles.categoryIcon}>
          <BriefcaseIcon color={dashboardColors.textHelper} size={22} />
        </View>
        <Text style={styles.categoryTitle}>No {label} jobs</Text>
        <Text style={styles.categoryBody}>
          {filter === 'all' ? 'Jobs' : JOB_STATUS_LABELS[filter]} jobs will
          appear here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: dashboardColors.artisanSurface,
    flex: 1,
  },
  chipScroll: {
    flexGrow: 0,
    paddingVertical: 16,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 24,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: dashboardColors.cardMuted,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  chipActive: {
    backgroundColor: dashboardColors.tabBar,
  },
  chipLabel: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  chipLabelActive: {
    color: dashboardColors.white,
    fontWeight: '600',
  },
  listContent: {
    gap: 12,
    paddingHorizontal: 24,
  },
  allEmpty: {
    marginTop: 45,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  illustrationCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(196, 178, 148, 0.35)',
    borderRadius: 130,
    height: 260,
    justifyContent: 'center',
    width: 260,
  },
  emptyTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 8,
  },
  emptyBody: {
    color: dashboardColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  categoryEmptyWrap: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryEmptyCard: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderRadius: 8,
    gap: 8,
    paddingVertical: 28,
  },
  categoryIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(105, 81, 57, 0.1)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 4,
    width: 48,
  },
  categoryTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  categoryBody: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
