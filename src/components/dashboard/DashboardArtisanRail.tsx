import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  formatCompactPrice,
  formatDistanceAway,
  formatRating,
  type Artisan,
} from '../../data/artisans';
import { dashboardColors } from '../../theme/dashboard';
import { HeartIcon, StarIcon } from '../icons';

const CARD_WIDTH = 165;
const NAME = '#1F1611';
const META = '#3D2E22';
const RATING = '#6B3F26';

type DashboardArtisanRailProps = Readonly<{
  title: string;
  artisans: readonly Artisan[];
  onSeeAll: () => void;
  onSelectArtisan: (artisan: Artisan) => void;
}>;

/**
 * Horizontal rail of artisan cards, shared by "Top artisans near you" and
 * "Recently viewed" so both read identically.
 */
export function DashboardArtisanRail({
  title,
  artisans,
  onSeeAll,
  onSelectArtisan,
}: DashboardArtisanRailProps) {
  const [favourites, setFavourites] = useState<readonly string[]>([]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  }, []);

  if (artisans.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
        >
          <Text style={styles.pillLabel}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.row}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {artisans.map(artisan => (
          <ArtisanCard
            artisan={artisan}
            isFavourite={favourites.includes(artisan.id)}
            key={artisan.id}
            onPress={onSelectArtisan}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type ArtisanCardProps = Readonly<{
  artisan: Artisan;
  isFavourite: boolean;
  onPress: (artisan: Artisan) => void;
  onToggleFavourite: (id: string) => void;
}>;

function ArtisanCard({
  artisan,
  isFavourite,
  onPress,
  onToggleFavourite,
}: ArtisanCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(artisan)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrapper}>
        <Image source={artisan.image} style={styles.image} />
        <Pressable
          accessibilityLabel={
            isFavourite
              ? `Remove ${artisan.name} from favourites`
              : `Save ${artisan.name} to favourites`
          }
          accessibilityRole="button"
          accessibilityState={{ selected: isFavourite }}
          hitSlop={10}
          onPress={() => onToggleFavourite(artisan.id)}
          style={styles.favourite}
        >
          <HeartIcon filled={isFavourite} />
        </Pressable>
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {artisan.name}
      </Text>
      <Text numberOfLines={1} style={styles.meta}>
        {artisan.trade} · {formatCompactPrice(artisan.priceFrom)}
      </Text>
      <View style={styles.ratingRow}>
        <StarIcon size={13} />
        <Text style={styles.rating}>
          {formatRating(artisan.rating)} · {formatDistanceAway(artisan.distanceKm)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.09)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pillLabel: {
    color: dashboardColors.tabBar,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
  scroll: {
    marginRight: -24,
  },
  row: {
    gap: 12,
    paddingRight: 24,
  },
  card: {
    width: CARD_WIDTH,
  },
  imageWrapper: {
    borderRadius: 14,
    height: 140,
    marginBottom: 10,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  favourite: {
    position: 'absolute',
    right: 14,
    top: 13,
  },
  name: {
    color: NAME,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  meta: {
    color: META,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  rating: {
    color: RATING,
    fontSize: 11,
    lineHeight: 16,
  },
});
