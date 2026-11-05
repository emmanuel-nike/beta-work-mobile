import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ArtisanDetail } from '../../api/artisans';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExpandIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
  StarIcon,
} from '../../components/icons';
import {
  formatDistance,
  formatFullPrice,
  formatRating,
} from '../../data/artisans';
import {
  findArtisan,
  getArtisanProfile,
  type OfferedService,
  type RatingBreakdown,
  type Review,
  type TrustItem,
} from '../../data/artisanProfiles';
import type { AuthStackScreenProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadArtisanDetail,
  selectArtisanDetail,
  selectArtisanDetailError,
  selectArtisanDetailStatus,
} from '../../store/slices/artisansSlice';

const PAGE = '#F7F1E6';
const CARD = '#F4E9DA';
const STAT = '#F5EDE2';
const SERVICE = '#FCF7EC';
const HEADING = '#1F1611';
const BODY = '#3D2E22';
const MUTED = '#736051';
const ACCENT = '#0F6743';
const LINE = '#DDD0BC';
const BAR_TRACK = '#DDD0BC';
const BAR_FILL = '#4F7E63';
const AVAILABLE = '#E8FFF0';
const HERO_HEIGHT = 330;
const SERVICE_PREVIEW = 4;
const GALLERY_PREVIEW = 2;

export function ArtisanProfileScreen({
  navigation,
  route,
}: AuthStackScreenProps<'ArtisanProfile'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const artisanId = route.params.artisanId;
  // Numeric ids come from the API. Catalogue rows (service prototypes) keep
  // their local profile until those lists are backed by the same endpoint.
  const isRemote = /^\d+$/.test(artisanId);
  const detail = useAppSelector(state => selectArtisanDetail(state, artisanId));
  const detailStatus = useAppSelector(state =>
    selectArtisanDetailStatus(state, artisanId),
  );
  const detailError = useAppSelector(state =>
    selectArtisanDetailError(state, artisanId),
  );
  const catalogueArtisan = isRemote ? undefined : findArtisan(artisanId);
  const [isFavourite, setFavourite] = useState(false);
  const [isBioExpanded, setBioExpanded] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [24, 88],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (isRemote) {
      dispatch(loadArtisanDetail(artisanId));
    }
  }, [artisanId, dispatch, isRemote]);

  if (isRemote && !detail) {
    return (
      <View style={[styles.root, styles.missing, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        {detailStatus === 'failed' ? (
          <>
            <Text style={styles.missingText}>
              {detailError ?? 'Unable to load this artisan.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => dispatch(loadArtisanDetail(artisanId))}
              style={styles.retry}
            >
              <Text style={styles.link}>Try again</Text>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator color={ACCENT} />
        )}
      </View>
    );
  }

  if (!isRemote && !catalogueArtisan) {
    return (
      <View style={[styles.root, styles.missing, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.missingText}>This artisan is no longer listed.</Text>
      </View>
    );
  }

  const profile = detail
    ? profileFromDetail(detail)
    : profileFromCatalogue(catalogueArtisan!);
  const firstName = profile.name.split(' ')[0] || 'artisan';
  const isBioLong = profile.bio.length > 160;
  const services = showAllServices
    ? profile.services
    : profile.services.slice(0, SERVICE_PREVIEW);
  const gallery = showAllGallery
    ? profile.gallery
    : profile.gallery.slice(0, GALLERY_PREVIEW);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const solid = event.nativeEvent.contentOffset.y > 48;
    setHeaderSolid(current => (current === solid ? current : solid));
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true, listener: onScroll },
  );

  function openMap() {
    const query =
      profile.latitude != null && profile.longitude != null
        ? `${profile.latitude},${profile.longitude}`
        : profile.area;
    Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(query)}`).catch(
      () => undefined,
    );
  }

  function shareProfile() {
    Share.share({
      message: `${profile.name} · ${profile.headline}`,
    }).catch(() => undefined);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle={headerSolid ? 'dark-content' : 'light-content'} />
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image resizeMode="cover" source={profile.image} style={styles.heroImage} />
          {profile.availableToday ? (
            <View style={styles.available}>
              <View style={styles.availableDot} />
              <Text style={styles.availableLabel}>Available today</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sheet}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.headline}>{profile.headline}</Text>

          <View style={styles.meta}>
            <StarIcon size={14} />
            <Text style={styles.metaText}>
              {formatRating(profile.rating)} ({profile.reviews})
            </Text>
          </View>
          <View style={styles.address}>
            <MapPinIcon color={ACCENT} size={14} />
            <Text style={styles.metaText}>{profile.area}</Text>
          </View>

          <View style={styles.stats}>
            {profile.stats.map(stat => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <Section
            action={isBioLong ? (isBioExpanded ? 'Read less' : 'Read more') : undefined}
            onAction={() => setBioExpanded(current => !current)}
            title="About"
          >
            <Text
              numberOfLines={isBioExpanded || !isBioLong ? undefined : 4}
              style={styles.paragraph}
            >
              {profile.bio || "This artisan hasn't added a bio yet."}
            </Text>
            {profile.chips.length > 0 ? (
              <View style={styles.chips}>
                {profile.chips.map(chip => (
                  <View key={chip} style={styles.chip}>
                    <Text style={styles.chipLabel}>{chip}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </Section>

          {profile.services.length > 0 ? (
            <Section
              action={showAllServices ? 'See less' : 'See all'}
              onAction={
                profile.services.length > SERVICE_PREVIEW
                  ? () => setShowAllServices(current => !current)
                  : undefined
              }
              title="Services offered"
            >
              <View style={styles.stack}>
                {services.map(service => (
                  <ServiceRow
                    key={service.name}
                    onPress={() =>
                      navigation.navigate('BookService', { artisanId })
                    }
                    service={service}
                  />
                ))}
              </View>
            </Section>
          ) : null}

          {profile.gallery.length > 0 ? (
            <Section
              action={showAllGallery ? 'See less' : 'See all'}
              onAction={
                profile.gallery.length > GALLERY_PREVIEW
                  ? () => setShowAllGallery(current => !current)
                  : undefined
              }
              title="Service Gallery"
            >
              <View style={styles.gallery}>
                {gallery.map((source, index) => (
                  <GalleryTile key={index} source={source} />
                ))}
              </View>
            </Section>
          ) : null}

          {profile.map ? (
            <Section title="Location">
              <View style={styles.map}>
                <Image source={profile.map} style={styles.mapImage} />
                <Pressable
                  accessibilityLabel="Open map"
                  accessibilityRole="button"
                  onPress={openMap}
                  style={styles.mapExpand}
                >
                  <ExpandIcon size={16} />
                </Pressable>
                <View style={styles.mapMarker}>
                  <Image source={profile.image} style={styles.mapMarkerImage} />
                  <View style={styles.mapMarkerBadge}>
                    <StarIcon size={8} />
                    <Text style={styles.mapMarkerRating}>
                      {formatRating(profile.rating)}
                    </Text>
                  </View>
                </View>
              </View>
            </Section>
          ) : null}

          <Section title="Ratings & Reviews">
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingValue}>
                {formatRating(profile.averageRating)}
              </Text>
              <StarRow rating={profile.averageRating} size={14} />
              <Text style={styles.ratingCount}>
                {profile.totalReviews} reviews
              </Text>
            </View>

            {profile.reviewItems.length > 0 ? (
              <>
                <View style={styles.breakdown}>
                  {profile.breakdown.map(row => (
                    <BreakdownRow
                      key={row.stars}
                      row={row}
                      total={profile.totalReviews}
                    />
                  ))}
                </View>

                <View style={styles.reviewToolbar}>
                  <Text style={styles.reviewCount}>
                    Showing {profile.reviewItems.length} of {profile.totalReviews}
                  </Text>
                  <View style={styles.newest}>
                    <Text style={styles.link}>Newest</Text>
                    <ChevronDownIcon color={ACCENT} size={14} />
                  </View>
                </View>

                <View style={styles.reviewList}>
                  {profile.reviewItems.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </View>

                {profile.totalReviews > profile.reviewItems.length ? (
                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.viewAll,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.viewAllLabel}>
                      See all {profile.totalReviews} reviews
                    </Text>
                  </Pressable>
                ) : null}
              </>
            ) : (
              <Text style={styles.emptyReviews}>
                {profile.totalReviews > 0
                  ? 'Individual reviews are not available yet.'
                  : 'No reviews yet.'}
              </Text>
            )}
          </Section>

          {profile.verification.length > 0 ? (
            <Section title="Trust & verification">
              <View style={styles.stack}>
                {profile.verification.map(item => (
                  <DetailCard key={item.title} detail={item.detail} title={item.title} />
                ))}
              </View>
            </Section>
          ) : null}

          {profile.terms.length > 0 ? (
            <Section title="Service terms">
              <View style={styles.stack}>
                {profile.terms.map(term => (
                  <DetailCard
                    key={term.label}
                    detail={term.detail}
                    splitOn={term.label === 'Availability' ? ';' : undefined}
                    title={term.label}
                  />
                ))}
              </View>
            </Section>
          ) : null}
        </View>
      </Animated.ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.topBar, { paddingTop: insets.top + 8 }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.topBarFill, { opacity: headerOpacity }]}
        />
        <View style={styles.topBarRow}>
          <CircleButton label="Go back" onPress={navigation.goBack}>
            <ArrowLeftIcon color={BODY} />
          </CircleButton>
          <View style={styles.topBarRight}>
            <CircleButton label="Share profile" onPress={shareProfile}>
              <ShareIcon color={BODY} />
            </CircleButton>
            <CircleButton
              label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
              onPress={() => setFavourite(current => !current)}
              selected={isFavourite}
            >
              <HeartIcon color={BODY} filled={isFavourite} size={18} />
            </CircleButton>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('BookService', { artisanId })}
          style={({ pressed }) => [styles.book, pressed && styles.pressed]}
        >
          <Text style={styles.bookLabel}>Book {firstName}</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ProfileStat = Readonly<{ value: string; label: string }>;

type DisplayedProfile = Readonly<{
  name: string;
  image: ImageSourcePropType;
  headline: string;
  bio: string;
  availableToday: boolean;
  stats: readonly ProfileStat[];
  rating: number;
  reviews: number;
  area: string;
  chips: readonly string[];
  services: readonly OfferedService[];
  gallery: readonly ImageSourcePropType[];
  map: ImageSourcePropType | null;
  latitude: number | null;
  longitude: number | null;
  averageRating: number;
  totalReviews: number;
  breakdown: readonly RatingBreakdown[];
  reviewItems: readonly Review[];
  verification: readonly TrustItem[];
  terms: ReadonlyArray<{ label: string; detail: string }>;
}>;

function profileFromDetail(detail: ArtisanDetail): DisplayedProfile {
  return {
    name: detail.name,
    image: detail.image,
    headline: detail.headline,
    bio: detail.bio,
    availableToday: detail.isAvailable,
    stats: [
      ...(detail.distanceKm == null
        ? []
        : [{ value: formatDistance(detail.distanceKm), label: 'away' }]),
      { value: yearsLabel(detail.yearsExperience), label: 'Job experience' },
      {
        value: priceLabel(detail.priceFrom),
        label: 'Starting price',
      },
    ],
    rating: detail.rating,
    reviews: detail.reviews,
    area: detail.area,
    chips: detail.languages ? [detail.languages] : [],
    services: detail.services,
    gallery: detail.gallery,
    map: mapSource(detail.latitude, detail.longitude),
    latitude: detail.latitude,
    longitude: detail.longitude,
    averageRating: detail.rating,
    totalReviews: detail.reviews,
    breakdown: [],
    reviewItems: [],
    verification: detail.verification,
    terms: detail.terms,
  };
}

function profileFromCatalogue(
  artisan: NonNullable<ReturnType<typeof findArtisan>>,
): DisplayedProfile {
  const profile = getArtisanProfile(artisan);
  return {
    name: artisan.name,
    image: artisan.image,
    headline: profile.headline,
    bio: profile.bio,
    availableToday: artisan.availableToday,
    stats: [
      { value: `${profile.completedJobs}`, label: 'Jobs completed' },
      { value: yearsLabel(profile.yearsExperience), label: 'Job experience' },
      { value: priceLabel(artisan.priceFrom), label: 'Starting price' },
    ],
    rating: artisan.rating,
    reviews: artisan.reviews,
    area: profile.area,
    chips: [profile.languages, ...profile.traits],
    services: profile.services,
    gallery: profile.gallery,
    map: profile.map,
    latitude: null,
    longitude: null,
    averageRating: profile.averageRating,
    totalReviews: profile.totalReviews,
    breakdown: profile.breakdown,
    reviewItems: profile.reviews,
    verification: profile.verification,
    terms: profile.terms,
  };
}

function yearsLabel(years: number): string {
  return years === 1 ? '1 yr' : `${years} yrs`;
}

function priceLabel(amount: number | null): string {
  if (amount == null || amount <= 0) {
    return 'Quote';
  }
  return formatFullPrice(amount);
}

function mapSource(
  latitude: number | null,
  longitude: number | null,
): ImageSourcePropType | null {
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }
  const center = `${latitude},${longitude}`;
  return {
    uri: `https://staticmap.openstreetmap.de/staticmap.php?center=${center}&zoom=14&size=600x450&markers=${center},red-pushpin`,
  };
}

function CircleButton({
  children,
  label,
  onPress,
  selected,
}: Readonly<{
  children: React.ReactNode;
  label: string;
  onPress?: () => void;
  selected?: boolean;
}>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={selected == null ? undefined : { selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.circle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

function Section({
  title,
  action,
  onAction,
  children,
}: Readonly<{
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}>) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action ? (
          onAction ? (
            <Pressable accessibilityRole="button" onPress={onAction}>
              <Text style={styles.link}>{action}</Text>
            </Pressable>
          ) : (
            <Text style={styles.link}>{action}</Text>
          )
        ) : null}
      </View>
      {children}
    </View>
  );
}

function ServiceRow({
  service,
  onPress,
}: Readonly<{ service: OfferedService; onPress: () => void }>) {
  const quoted = service.priceLabel === 'Get a quote';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.serviceRow, pressed && styles.pressed]}
    >
      <View style={styles.serviceCopy}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={quoted ? styles.serviceQuote : styles.servicePrice}>
          {service.priceLabel}
        </Text>
      </View>
      <ChevronRightIcon color={BODY} size={18} />
    </Pressable>
  );
}

function DetailCard({
  title,
  detail,
  splitOn,
}: Readonly<{ title: string; detail: string; splitOn?: string }>) {
  const lines = splitOn
    ? detail
        .split(splitOn)
        .map(line => line.trim())
        .filter(Boolean)
    : [detail];

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceCopy}>
        <Text style={styles.serviceName}>{title}</Text>
        {lines.map((line, index) => (
          <Text key={`${title}-${index}`} style={styles.serviceQuote}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

function GalleryTile({ source }: Readonly<{ source: ImageSourcePropType }>) {
  return (
    <View style={styles.galleryTile}>
      <Image resizeMode="cover" source={source} style={styles.galleryImage} />
    </View>
  );
}

function StarRow({
  rating,
  size = 12,
}: Readonly<{ rating: number; size?: number }>) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(step => (
        <StarIcon filled={rating >= step - 0.25} key={step} size={size} />
      ))}
    </View>
  );
}

function BreakdownRow({
  row,
  total,
}: Readonly<{ row: RatingBreakdown; total: number }>) {
  const ratio = total === 0 ? 0 : row.count / total;

  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{row.stars} star</Text>
      <View style={styles.breakdownTrack}>
        <View
          style={[styles.breakdownFill, { width: `${Math.round(ratio * 100)}%` }]}
        />
      </View>
      <Text style={styles.breakdownCount}>{row.count}</Text>
    </View>
  );
}

function ReviewCard({ review }: Readonly<{ review: Review }>) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={review.avatar} style={styles.reviewAvatar} />
        <Text style={styles.reviewAuthor}>
          {review.author}, {review.area}
        </Text>
      </View>
      <View style={styles.reviewMeta}>
        <StarRow rating={review.rating} />
        <Text style={styles.reviewAgo}>{review.postedAgo}</Text>
      </View>
      <Text style={styles.reviewBody}>{review.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: PAGE,
    flex: 1,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingText: {
    color: MUTED,
    fontSize: 14,
    textAlign: 'center',
  },
  retry: {
    marginTop: 12,
  },
  emptyReviews: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
  content: {
    paddingBottom: 8,
  },
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: '#D8C7AD',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  available: {
    alignItems: 'center',
    backgroundColor: AVAILABLE,
    borderRadius: 13,
    bottom: 44,
    flexDirection: 'row',
    gap: 6,
    height: 26,
    left: 24,
    paddingHorizontal: 10,
    position: 'absolute',
  },
  availableDot: {
    backgroundColor: ACCENT,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  availableLabel: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '600',
  },
  sheet: {
    backgroundColor: PAGE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  name: {
    color: HEADING,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  headline: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  metaText: {
    color: BODY,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  address: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: STAT,
    borderColor: LINE,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 74,
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  statValue: {
    color: HEADING,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  statLabel: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: HEADING,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  link: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  paragraph: {
    color: BODY,
    fontSize: 14,
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  chip: {
    backgroundColor: '#EDE4D5',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  chipLabel: {
    color: BODY,
    fontSize: 12,
    lineHeight: 16,
  },
  stack: {
    gap: 8,
  },
  serviceRow: {
    alignItems: 'center',
    backgroundColor: SERVICE,
    borderColor: LINE,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  serviceCopy: {
    flex: 1,
    gap: 4,
  },
  serviceName: {
    color: HEADING,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  servicePrice: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  serviceQuote: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  galleryTile: {
    borderRadius: 8,
    flexBasis: '46%',
    flexGrow: 1,
    height: 140,
    overflow: 'hidden',
  },
  galleryImage: {
    height: '100%',
    width: '100%',
  },
  map: {
    borderRadius: 8,
    height: 398,
    overflow: 'hidden',
  },
  mapImage: {
    height: '100%',
    width: '100%',
  },
  mapExpand: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 36,
  },
  mapMarker: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    left: '50%',
    marginLeft: -28,
    padding: 3,
    position: 'absolute',
    top: 150,
  },
  mapMarkerImage: {
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  mapMarkerBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    bottom: -6,
    flexDirection: 'row',
    gap: 2,
    height: 18,
    justifyContent: 'center',
    paddingHorizontal: 6,
    position: 'absolute',
  },
  mapMarkerRating: {
    color: HEADING,
    fontSize: 9,
    fontWeight: '600',
    lineHeight: 12,
  },
  ratingSummary: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ratingValue: {
    color: HEADING,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  ratingCount: {
    color: MUTED,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  breakdown: {
    gap: 12,
    marginTop: 18,
  },
  breakdownRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  breakdownLabel: {
    color: BODY,
    fontSize: 12,
    lineHeight: 16,
    width: 44,
  },
  breakdownTrack: {
    backgroundColor: BAR_TRACK,
    borderRadius: 4,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  breakdownFill: {
    backgroundColor: BAR_FILL,
    borderRadius: 4,
    height: '100%',
  },
  breakdownCount: {
    color: BODY,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    width: 24,
  },
  reviewToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  reviewCount: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
  },
  newest: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  reviewList: {
    gap: 12,
    marginTop: 12,
  },
  reviewCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  reviewAvatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  reviewAuthor: {
    color: HEADING,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  reviewMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  reviewAgo: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
  },
  reviewBody: {
    color: BODY,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  viewAll: {
    alignItems: 'center',
    borderColor: LINE,
    borderRadius: 6,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
  viewAllLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  topBar: {
    left: 0,
    paddingBottom: 8,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  topBarFill: {
    backgroundColor: PAGE,
    borderBottomColor: '#DDD0BC',
    borderBottomWidth: 0.4,
    bottom: 0,
    elevation: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: '#1F1611',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    top: 0,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 16,
  },
  circle: {
    alignItems: 'center',
    backgroundColor: '#EDE4D5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  footer: {
    backgroundColor: PAGE,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  book: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 6,
    height: 48,
    justifyContent: 'center',
  },
  bookLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
