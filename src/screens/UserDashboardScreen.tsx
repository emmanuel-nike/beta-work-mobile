import { memo, useState } from 'react';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  DashboardCard,
  DashboardHeader,
  DashboardShell,
  SearchBar,
  SectionHeader,
} from '../components/dashboard/DashboardShell';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import { DashboardBookingsSection } from '../components/dashboard/DashboardBookingsSection';
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

const POPULAR_ARTISANS = [
  {
    id: 'femi',
    name: 'Femi A.',
    service: 'Plumbing',
    rating: '4.9',
    reviews: '128',
    image: require('../../assets/images/dashboard/image0_1174_145674.png'),
  },
  {
    id: 'ada',
    name: 'Ada O.',
    service: 'Hair styling',
    rating: '5.0',
    reviews: '96',
    image: require('../../assets/images/dashboard/image1_1174_145674.png'),
  },
  {
    id: 'chioma',
    name: 'Chioma E.',
    service: 'Cleaning',
    rating: '4.8',
    reviews: '74',
    image: require('../../assets/images/dashboard/image2_1174_145674.png'),
  },
] as const;

const RECENT_ARTISANS = [
  {
    id: 'recent-1',
    name: 'Tunde M.',
    service: 'Electrical repairs',
    rating: '4.7',
    image: require('../../assets/images/dashboard/image1_676_87466.png'),
  },
  {
    id: 'recent-2',
    name: 'Ngozi P.',
    service: 'Tailoring',
    rating: '4.9',
    image: require('../../assets/images/dashboard/image0_676_87466.png'),
  },
] as const;

export function UserDashboardScreen() {
  const user = useAppSelector(selectAuthUser);
  const firstName = user?.firstName?.trim() || 'there';
  const authNavigation = useAuthNavigation();
  const tabNavigation = useClientTabNavigation();
  const dashboardBookings = BOOKINGS.slice(0, DASHBOARD_BOOKING_LIMIT);
  const [isLocationPickerOpen, setLocationPickerOpen] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION_LABEL);

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
          footer={<SearchBar />}
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
          data={ARTISAN_SERVICES}
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

      <View style={styles.section}>
        <SectionHeader actionLabel="See all" title="Popular near you" />
        <ScrollView
          contentContainerStyle={styles.artisanRow}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          {POPULAR_ARTISANS.map(artisan => (
            <ArtisanCard key={artisan.id} {...artisan} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader actionLabel="See all" title="Recently viewed" />
        <ScrollView
          contentContainerStyle={styles.artisanRow}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          {RECENT_ARTISANS.map(artisan => (
            <CompactArtisanCard key={artisan.id} {...artisan} />
          ))}
        </ScrollView>
      </View>

      <DashboardCard style={styles.promoCard}>
        <Text style={styles.promoEyebrow}>Beta Work Guarantee</Text>
        <Text style={styles.promoTitle}>
          Book verified artisans with confidence
        </Text>
        <Text style={styles.promoBody}>
          Every artisan is background-checked so you can hire safely for your
          home or business.
        </Text>
        <Pressable accessibilityRole="button" style={styles.promoButton}>
          <Text style={styles.promoButtonLabel}>Post a job</Text>
        </Pressable>
      </DashboardCard>

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

function ArtisanCard({
  image,
  name,
  rating,
  reviews,
  service,
}: Readonly<(typeof POPULAR_ARTISANS)[number]>) {
  return (
    <Pressable accessibilityRole="button" style={styles.artisanCard}>
      <Image source={image} style={styles.artisanImage} />
      <View style={styles.artisanMeta}>
        <View style={styles.verifiedRow}>
          <Text style={styles.artisanName}>{name}</Text>
          <Text style={styles.verifiedBadge}>Verified</Text>
        </View>
        <Text style={styles.artisanService}>{service}</Text>
        <Text style={styles.artisanRating}>
          ★ {rating} ({reviews})
        </Text>
      </View>
    </Pressable>
  );
}

function CompactArtisanCard({
  image,
  name,
  rating,
  service,
}: Readonly<(typeof RECENT_ARTISANS)[number]>) {
  return (
    <Pressable accessibilityRole="button" style={styles.compactCard}>
      <Image source={image} style={styles.compactImage} />
      <Text style={styles.compactName}>{name}</Text>
      <Text style={styles.compactService}>{service}</Text>
      <Text style={styles.compactRating}>★ {rating}</Text>
    </Pressable>
  );
}

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
  artisanRow: {
    gap: 16,
    paddingRight: 24,
  },
  artisanCard: {
    backgroundColor: dashboardColors.white,
    borderRadius: 16,
    overflow: 'hidden',
    width: 165,
  },
  artisanImage: {
    height: 110,
    width: '100%',
  },
  artisanMeta: {
    gap: 4,
    padding: 12,
  },
  verifiedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  artisanName: {
    color: dashboardColors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(15, 103, 67, 0.12)',
    borderRadius: 10,
    color: dashboardColors.tabBar,
    fontSize: 10,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  artisanService: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  artisanRating: {
    color: dashboardColors.star,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  compactCard: {
    backgroundColor: dashboardColors.white,
    borderRadius: 16,
    padding: 12,
    width: 140,
  },
  compactImage: {
    borderRadius: 12,
    height: 88,
    marginBottom: 10,
    width: '100%',
  },
  compactName: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  compactService: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  compactRating: {
    color: dashboardColors.star,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginTop: 6,
  },
  promoCard: {
    backgroundColor: dashboardColors.promo,
    borderRadius: 12,
    gap: 8,
    padding: 20,
  },
  promoEyebrow: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  promoTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  promoBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  promoButton: {
    alignSelf: 'flex-start',
    backgroundColor: dashboardColors.tabBar,
    borderRadius: 6,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  promoButtonLabel: {
    color: dashboardColors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
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
