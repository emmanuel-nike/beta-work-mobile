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
  ArrowLeftIcon,
  ChevronDownIcon,
  HeartIcon,
  JobsCompletedIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
} from '../../components/icons';
import {
  findArtisanService,
  serviceListTitle,
  serviceSearchPlaceholder,
} from '../../data/artisanServices';
import {
  formatDistance,
  formatFullPrice,
  formatRating,
  getArtisansForService,
  type Artisan,
} from '../../data/artisans';
import type { AuthStackScreenProps } from '../../navigation/types';

const SURFACE = '#F7F1E6';
const CARD_BORDER = '#DDD0BC';
const NAME = '#1B1105';
const BODY = '#3D2E22';
const MUTED = '#736051';
const PRICE = '#6B3F26';
const ACCENT = '#0F6743';

const SORTS = [
  { id: 'top-rated', label: 'Top rated' },
  { id: 'price', label: 'Price' },
  { id: 'availability', label: 'Availability' },
] as const;

type SortId = (typeof SORTS)[number]['id'];

export function ServiceArtisansScreen({
  navigation,
  route,
}: AuthStackScreenProps<'ServiceArtisans'>) {
  const insets = useSafeAreaInsets();
  const service = findArtisanService(route.params.serviceId);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortId>('top-rated');
  const [favourites, setFavourites] = useState<readonly string[]>([]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = getArtisansForService(route.params.serviceId).filter(
      artisan =>
        needle.length === 0 ||
        artisan.name.toLowerCase().includes(needle) ||
        artisan.trade.toLowerCase().includes(needle),
    );
    const sorted = [...matched];
    if (sort === 'price') {
      sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (sort === 'availability') {
      sorted.sort((a, b) => Number(b.availableToday) - Number(a.availableToday));
    } else {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [query, route.params.serviceId, sort]);

  const title = service ? serviceListTitle(service.label) : 'Artisans near you';
  const placeholder = service
    ? serviceSearchPlaceholder(service.label)
    : 'Search artisans';

  const openProfile = (artisan: Artisan) =>
    navigation.navigate('ArtisanProfile', { artisanId: artisan.id });

  const toggleFavourite = (id: string) =>
    setFavourites(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={navigation.goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ArrowLeftIcon color={BODY} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Verified professionals in your area
          </Text>
        </View>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.searchField}>
        <SearchIcon color={BODY} size={18} />
        <TextInput
          autoCorrect={false}
          onChangeText={setQuery}
          placeholder={placeholder}
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
        {SORTS.map(item => {
          const selected = item.id === sort;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={item.id}
              onPress={() => setSort(item.id)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>
                {item.label}
              </Text>
              {selected ? <ChevronDownIcon color={ACCENT} size={14} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        ListEmptyComponent={
          <Text style={styles.empty}>No artisans match your search just yet.</Text>
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
    </View>
  );
}

function ArtisanListCard({
  artisan,
  isFavourite,
  onPress,
  onToggleFavourite,
}: Readonly<{
  artisan: Artisan;
  isFavourite: boolean;
  onPress: (artisan: Artisan) => void;
  onToggleFavourite: (id: string) => void;
}>) {
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
    borderBottomColor: CARD_BORDER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  back: {
    alignItems: 'center',
    backgroundColor: '#EDE4D5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backSpacer: {
    width: 40,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: NAME,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    textAlign: 'center',
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
    marginTop: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: NAME,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  chipScroll: {
    flexGrow: 0,
    marginTop: 16,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 24,
  },
  chip: {
    alignItems: 'center',
    borderColor: '#A99F8E',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 41,
    paddingHorizontal: 12,
  },
  chipOn: {
    backgroundColor: '#E4EDE7',
    borderColor: ACCENT,
  },
  radio: {
    alignItems: 'center',
    borderColor: '#A99F8E',
    borderRadius: 8,
    borderWidth: 1.5,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  radioOn: {
    borderColor: ACCENT,
  },
  radioDot: {
    backgroundColor: ACCENT,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  chipLabel: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
  },
  chipLabelOn: {
    color: ACCENT,
    fontWeight: '600',
  },
  listContent: {
    gap: 13,
    paddingHorizontal: 24,
  },
  count: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    paddingBottom: 4,
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
    minHeight: 135,
    padding: 8.5,
  },
  thumbWrapper: {
    borderRadius: 12,
    height: 118,
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
    paddingHorizontal: 8,
    position: 'absolute',
  },
  availabilityLabel: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
  cardBody: {
    flex: 1,
    paddingTop: 4,
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
    paddingTop: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});
