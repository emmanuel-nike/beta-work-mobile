import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
} from '../../components/icons';
import type { AuthStackScreenProps } from '../../navigation/types';
import { useClientTabNavigation } from '../../navigation/types';
import { useBookingArtisan } from './useBookingArtisan';

const SuccessArtwork = require('../../../assets/images/signup-success.png');

const SURFACE = '#F4E9DA';
const TITLE = '#1F1611';
const BODY = '#5C4A38';
const MUTED = '#8B6B4D';
const ACCENT = '#0F6743';
const CARD = '#FBF7EF';
const DIVIDER = '#E7DCC9';

export function BookingRequestedScreen({
  navigation,
  route,
}: AuthStackScreenProps<'BookingRequested'>) {
  const insets = useSafeAreaInsets();
  const tabNavigation = useClientTabNavigation();
  const { artisanId, draft } = route.params;
  const artisan = useBookingArtisan(artisanId);
  const firstName = artisan?.name.split(' ')[0] ?? 'the artisan';

  const backToHome = () => navigation.popToTop();
  const viewBooking = () => {
    navigation.popToTop();
    tabNavigation.navigate('bookings');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.body}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={SuccessArtwork}
          style={styles.artwork}
        />
        <Text style={styles.title}>Booking request sent!</Text>
        <Text style={styles.subtitle}>
          Your request has been sent to {firstName}. We&apos;ll let you know when
          the artisan responds.
        </Text>

        {artisan ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={artisan.image} style={styles.avatar} />
              <View style={styles.cardHeaderCopy}>
                <Text numberOfLines={1} style={styles.name}>
                  {artisan.name}
                </Text>
                <Text numberOfLines={1} style={styles.headline}>
                  {artisan.headline}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <SummaryRow
              icon={<BriefcaseIcon color={MUTED} size={16} />}
              value={draft.serviceLabel ?? '—'}
            />
            <SummaryRow
              icon={<CalendarIcon color={MUTED} size={16} />}
              value={draft.dateTimeLabel ?? '—'}
            />
            <SummaryRow
              icon={<MapPinIcon color={MUTED} size={16} />}
              value={draft.location || '—'}
            />
          </View>
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={viewBooking}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaLabel}>View booking</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={backToHome}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
          <Text style={styles.secondaryLabel}>Back to home</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SummaryRow({
  icon,
  value,
}: Readonly<{ icon: React.ReactNode; value: string }>) {
  return (
    <View style={styles.summaryRow}>
      {icon}
      <Text numberOfLines={1} style={styles.summaryValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
  },
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  artwork: {
    height: 180,
    width: 220,
  },
  title: {
    color: TITLE,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27,
    marginTop: 8,
  },
  subtitle: {
    color: BODY,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    marginTop: 28,
    padding: 18,
    width: '100%',
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#DAD3C7',
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  cardHeaderCopy: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: TITLE,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  headline: {
    color: '#6B4B2E',
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    backgroundColor: DIVIDER,
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 7,
  },
  summaryValue: {
    color: BODY,
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  secondary: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 6,
  },
  secondaryLabel: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
