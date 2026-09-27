import { memo, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  DashboardHeader,
  DashboardShell,
  SearchBar,
  SectionHeader,
} from '../components/dashboard/DashboardShell';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import { DashboardBookingsSection } from '../components/dashboard/DashboardBookingsSection';
import { DashboardArtisanRail } from '../components/dashboard/DashboardArtisanRail';
import { WhyBetaWorkSection } from '../components/dashboard/WhyBetaWorkSection';
import {
  RECENTLY_VIEWED_ARTISANS,
  TOP_ARTISANS,
  type Artisan,
} from '../data/artisans';
import { ARTISAN_SERVICES } from '../data/artisanServices';
import { BOOKINGS, type Booking } from '../data/bookings';
import { DEFAULT_LOCATION_LABEL, type SavedAddress } from '../data/locations';
import {
  useAuthNavigation,
  useClientTabNavigation,
} from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/authSlice';
import { dashboardColors } from '../theme/dashboard';

/** The dashboard previews only the most recent bookings. */
const DASHBOARD_BOOKING_LIMIT = 10;

/** The dashboard shows a short strip of services; the rest live behind "View all". */
const DASHBOARD_SERVICE_LIMIT = 7;
const DASHBOARD_SERVICES = ARTISAN_SERVICES.slice(0, DASHBOARD_SERVICE_LIMIT);

export function UserDashboardScreen() {
  const user = useAppSelector(selectAuthUser);
  const firstName = user?.firstName?.trim() || 'there';
  const authNavigation = useAuthNavigation();
  const tabNavigation = useClientTabNavigation();

  const openAllArtisans = (title?: string) =>
    authNavigation.navigate('AllArtisans', title ? { title } : undefined);
  const dashboardBookings = BOOKINGS.slice(0, DASHBOARD_BOOKING_LIMIT);
  const [isLocationPickerOpen, setLocationPickerOpen] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION_LABEL);

  const handleSelectArtisan = (artisan: Artisan) =>
    authNavigation.navigate('ArtisanProfile', { artisanId: artisan.id });

  const handleSelectLocation = (address: SavedAddress) => {
    setLocation(address.label);
    setLocationPickerOpen(false);
  };

  const openBookings = () => tabNavigation.navigate('bookings');
  const openBooking = (booking: Booking) =>
    authNavigation.navigate('BookingDetails', { bookingId: booking.id });

  return (
    <DashboardShell
      contentStyle={styles.content}
      scrollHeader={
        <DashboardHeader
          firstName={firstName}
          footer={<SearchBar onPress={() => openAllArtisans()} />}
          location={location}
          onLocationPress={() => setLocationPickerOpen(true)}
          subtitle="What do you need help with today?"
        />
      }
      showTabBar={false}
    >
      <View style={styles.servicesSection}>
        <View style={styles.servicesHeader}>
          <Text style={styles.servicesTitle}>Browse services</Text>
          <Pressable accessibilityRole="button" style={styles.viewAllButton}>
            <Text style={styles.viewAllLabel}>View all</Text>
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={styles.servicesRow}
          data={DASHBOARD_SERVICES}
          getItemLayout={(_, index) => ({
            index,
            length: 88,
            offset: 88 * index,
          })}
          horizontal
          initialNumToRender={5}
          keyExtractor={service => service.id}
          maxToRenderPerBatch={3}
          nestedScrollEnabled
          removeClippedSubviews
          renderItem={renderService}
          showsHorizontalScrollIndicator={false}
          style={styles.servicesScroll}
          windowSize={3}
        />
      </View>

      <DashboardBookingsSection
        bookings={dashboardBookings}
        onBookService={openBookings}
        onSeeAll={openBookings}
        onSelectBooking={openBooking}
      />

      <DashboardArtisanRail
        artisans={TOP_ARTISANS}
        onSeeAll={() => openAllArtisans('Top artisans near you')}
        onSelectArtisan={handleSelectArtisan}
        title="Top artisans near you"
      />

      <WhyBetaWorkSection />

      <DashboardArtisanRail
        artisans={RECENTLY_VIEWED_ARTISANS}
        onSeeAll={() => openAllArtisans('Recently viewed')}
        onSelectArtisan={handleSelectArtisan}
        title="Recently viewed"
      />


      <View style={styles.section}>
        <SectionHeader title="Tips for hiring" />
        <ScrollView
          contentContainerStyle={styles.tipsRow}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          <TipCard
            body="Share clear photos and timelines to get faster responses."
            title="Describe the job clearly"
          />
          <TipCard
            body="Verified artisans respond 3x faster on average."
            title="Choose verified pros"
          />
        </ScrollView>
      </View>

      <ChangeLocationModal
        onClose={() => setLocationPickerOpen(false)}
        onSelect={handleSelectLocation}
        visible={isLocationPickerOpen}
      />
    </DashboardShell>
  );
}

type ArtisanService = (typeof ARTISAN_SERVICES)[number];

function renderService({ item }: ListRenderItemInfo<ArtisanService>) {
  return <ServiceTile {...item} />;
}

const ServiceTile = memo(function ServiceTile({
  Artwork,
  label,
}: Readonly<ArtisanService>) {
  return (
    <Pressable accessibilityRole="button" style={styles.serviceTile}>
      <View style={styles.serviceArtwork}>
        <Artwork height="100%" width="100%" />
      </View>
      <Text numberOfLines={2} style={styles.serviceLabel}>
        {label}
      </Text>
    </Pressable>
  );
});

function TipCard({ body, title }: Readonly<{ body: string; title: string }>) {
  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
  },
  servicesSection: {
    gap: 16,
  },
  servicesHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servicesTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  viewAllButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.09)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  viewAllLabel: {
    color: dashboardColors.tabBar,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  servicesRow: {
    gap: 8,
    paddingRight: 24,
  },
  servicesScroll: {
    marginRight: -24,
  },
  serviceTile: {
    gap: 6,
    width: 80,
  },
  serviceArtwork: {
    backgroundColor: dashboardColors.category,
    borderRadius: 10,
    height: 79,
    overflow: 'hidden',
    width: 80,
  },
  serviceLabel: {
    color: dashboardColors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  section: {
    gap: 16,
  },
  tipsRow: {
    gap: 12,
    paddingRight: 24,
  },
  tipCard: {
    backgroundColor: dashboardColors.promo,
    borderRadius: 12,
    padding: 16,
    width: 260,
  },
  tipTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 6,
  },
  tipBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
