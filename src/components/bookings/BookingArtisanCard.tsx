import { Image, StyleSheet, Text, View } from 'react-native';

import { formatRating } from '../../data/artisans';
import type { BookingArtisan } from '../../screens/bookings/useBookingArtisan';
import { MapPinIcon, StarIcon } from '../icons';

const CARD = '#F3E8D7';
const NAME = '#1F1611';
const HEADLINE = '#6B4B2E';
const META = '#3D2E22';
const MUTED = '#736051';
const STAR = '#E9775C';

/** The artisan summary header shared by the Book / Review booking screens. */
export function BookingArtisanCard({
  artisan,
}: Readonly<{ artisan: BookingArtisan }>) {
  return (
    <View style={styles.card}>
      <Image source={artisan.image} style={styles.avatar} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {artisan.name}
        </Text>
        <Text numberOfLines={1} style={styles.headline}>
          {artisan.headline}
        </Text>
        <View style={styles.metaRow}>
          <StarIcon color={STAR} size={14} />
          <Text style={styles.meta}>
            {formatRating(artisan.rating)} ({artisan.reviews} reviews)
          </Text>
          <MapPinIcon color={MUTED} size={13} />
          <Text numberOfLines={1} style={styles.metaMuted}>
            {artisan.area}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  avatar: {
    backgroundColor: '#DAD3C7',
    borderRadius: 32,
    height: 64,
    width: 64,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: NAME,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
  },
  headline: {
    color: HEADLINE,
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  meta: {
    color: META,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginRight: 6,
  },
  metaMuted: {
    color: MUTED,
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
