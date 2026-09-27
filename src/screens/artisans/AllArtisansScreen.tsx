import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DEFAULT_ARTISAN_FILTERS,
  FilterArtisansSheet,
  type ArtisanFilters,
} from '../../components/artisans/FilterArtisansSheet';
import { ChangeLocationModal } from '../../components/dashboard/ChangeLocationModal';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  FilterIcon,
  HeartIcon,
  JobsCompletedIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
} from '../../components/icons';
import {
  ARTISANS,
  ARTISAN_CATEGORIES,
  formatDistance,
  formatFullPrice,
  formatRating,
  type Artisan,
  type ArtisanCategory,
} from '../../data/artisans';
import { DEFAULT_LOCATION_LABEL } from '../../data/locations';
import type { AuthStackScreenProps } from '../../navigation/types';

const SURFACE = '#F7F1E6';
const CARD_BORDER = '#DDD0BC';
const CHIP_INACTIVE = '#EDE4D5';
const NAME = '#1B1105';
const BODY = '#3D2E22';
const MUTED = '#736051';
const PRICE = '#6B3F26';
const ACCENT = '#0F6743';

export function AllArtisansScreen({
  navigation,
  route,
}: AuthStackScreenProps<'AllArtisans'>) {
  const insets = useSafeAreaInsets();
  const title = route.params?.title ?? 'All artisans';
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [category, setCategory] = useState<ArtisanCategory | 'all'>('all');
  const [filters, setFilters] = useState<ArtisanFilters>(DEFAULT_ARTISAN_FILTERS);
  const [favourites, setFavourites] = useState<readonly string[]>([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION_LABEL);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matched = ARTISANS.filter(artisan => {
      if (category !== 'all' && artisan.category !== category) {
        return false;
      }
      if (
        needle.length > 0 &&
        !artisan.name.toLowerCase().includes(needle) &&
        !artisan.trade.toLowerCase().includes(needle)
      ) {
        return false;
      }
      if (artisan.rating < filters.minRating) {
        return false;
      }
      if (
        artisan.distanceKm < filters.distance.min ||
        artisan.distanceKm > filters.distance.max
      ) {
        return false;
      }
      return (
        artisan.priceFrom >= filters.price.min &&
        artisan.priceFrom <= filters.price.max
      );
    });

    const sorted = [...matched];
    if (filters.sort === 'nearest') {
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (filters.sort === 'lowest-price') {
      sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    } else {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [category, filters, query]);

  const openProfile = (artisan: Artisan) =>
    navigation.navigate('ArtisanProfile', { artisanId: artisan.id });

  const toggleFavourite = (id: string) =>
    setFavourites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 25 }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={navigation.goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ArrowLeftIcon color={NAME} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Skilled professionals near you</Text>
        </View>
        <View style={styles.back} />
      </View>

      <View style={styles.searchField}>
        <SearchIcon color={MUTED} size={18} />
        <TextInput
          autoCorrect={false}
          onChangeText={setQuery}
          placeholder="Search for by name or service"
          placeholderTextColor={MUTED}
          returnKeyType="search"
          style={styles.searchInput}
          value={query}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.chipRow}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
      >
        {ARTISAN_CATEGORIES.map(item => {
          const isActive = item.id === category;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={item.id}
              onPress={() => setCategory(item.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setLocationOpen(true)}
          style={({ pressed }) => [styles.location, pressed && styles.pressed]}
        >
          <MapPinIcon color={BODY} size={16} />
          <Text style={styles.locationLabel}>{location}</Text>
          <ChevronDownIcon color={BODY} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setFilterOpen(true)}
          style={({ pressed }) => [styles.filter, pressed && styles.pressed]}
        >
          <FilterIcon />
          <Text style={styles.filterLabel}>Filter</Text>
        </Pressable>
      </View>

      <FlatList
        ListEmptyComponent={
          <Text style={styles.empty}>
            No artisans match your search just yet.
          </Text>
        }
        ListHeaderComponent={
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'artisan' : 'artisans'} nearby
          </Text>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        data={results}
        keyExtractor={artisan => artisan.id}
        renderItem={({ item }) => (
          <ArtisanListCard
            artisan={item}
            isFavourite={favourites.includes(item.id)}
            onPress={openProfile}
            onToggleFavourite={toggleFavourite}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <FilterArtisansSheet
        filters={filters}
        onApply={next => {
          setFilters(next);
          setFilterOpen(false);
        }}
        onClose={() => setFilterOpen(false)}
        visible={isFilterOpen}
      />

      <ChangeLocationModal
        onClose={() => setLocationOpen(false)}
        onSelect={address => {
          setLocation(address.label);
          setLocationOpen(false);
        }}
        visible={isLocationOpen}
      />
    </View>
  );
}

type ArtisanListCardProps = Readonly<{
  artisan: Artisan;
  isFavourite: boolean;
  onPress: (artisan: Artisan) => void;
  onToggleFavourite: (id: string) => void;
}>;

function ArtisanListCard({
  artisan,
  isFavourite,
  onPress,
  onToggleFavourite,
}: ArtisanListCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(artisan)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumbWrapper}>
        <Image source={artisan.image} style={styles.thumb} />
        {artisan.availableToday ? (
          <View style={styles.availability}>
            <Text style={styles.availabilityLabel}>Available today</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.name}>
          {artisan.name}
        </Text>
        <Text numberOfLines={1} style={styles.trade}>
          {artisan.trade}
        </Text>

        <View style={styles.statRow}>
          <StarIcon size={12} />
          <Text style={styles.stat}>
            {formatRating(artisan.rating)} ({artisan.reviews})
          </Text>
          <MapPinIcon color={MUTED} size={12} />
          <Text style={styles.stat}>{formatDistance(artisan.distanceKm)}</Text>
        </View>

        <Text style={styles.price}>From {formatFullPrice(artisan.priceFrom)}</Text>

        <View style={styles.jobsRow}>
          <JobsCompletedIcon />
          <Text style={styles.jobs}>{artisan.jobsCompleted} jobs completed</Text>
        </View>
      </View>

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
        <HeartIcon color={isFavourite ? '#E9775C' : BODY} filled={isFavourite} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  back: {
    alignItems: 'center',
    backgroundColor: CHIP_INACTIVE,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#1F1611',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  searchField: {
    alignItems: 'center',
    backgroundColor: '#F5EDE2',
    borderColor: '#A99F8E',
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 10,
    height: 48,
    marginHorizontal: 24,
    marginTop: 17,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: NAME,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  chipScroll: {
    flexGrow: 0,
    height: 44,
    marginTop: 24,
  },
  chipRow: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: CHIP_INACTIVE,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: ACCENT,
  },
  chipLabel: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
  },
  chipLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  location: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  locationLabel: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
  },
  filter: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.09)',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 6,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  filterLabel: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  listContent: {
    gap: 13,
    paddingHorizontal: 24,
  },
  count: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  empty: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    paddingTop: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: SURFACE,
    borderColor: CARD_BORDER,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 140,
    padding: 8.5,
  },
  thumbWrapper: {
    borderRadius: 12,
    height: 123,
    overflow: 'hidden',
    width: 111,
  },
  thumb: {
    height: '100%',
    width: '100%',
  },
  availability: {
    alignItems: 'center',
    backgroundColor: 'rgba(213, 227, 218, 0.86)',
    borderRadius: 10.5,
    bottom: 8,
    height: 21,
    justifyContent: 'center',
    left: 8,
    position: 'absolute',
    paddingHorizontal: 8,
  },
  availabilityLabel: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
  cardBody: {
    flex: 1,
    paddingTop: 9,
  },
  name: {
    color: NAME,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  trade: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  stat: {
    color: BODY,
    fontSize: 11,
    lineHeight: 15,
    marginRight: 4,
  },
  price: {
    color: PRICE,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 8,
  },
  jobsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
  },
  jobs: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 15,
  },
  favourite: {
    paddingLeft: 4,
    paddingTop: 9,
  },
  pressed: {
    opacity: 0.75,
  },
});
