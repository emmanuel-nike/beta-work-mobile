import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowLeftIcon,
  ExpandIcon,
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
  StarIcon,
} from '../../components/icons';
import { formatCompactPrice, formatRating } from '../../data/artisans';
import {
  findArtisan,
  getArtisanProfile,
  type RatingBreakdown,
  type Review,
} from '../../data/artisanProfiles';
import type { AuthStackScreenProps } from '../../navigation/types';

const SURFACE = '#F4E9DA';
const TOP_SURFACE = '#F7F1E6';
const INFO_SURFACE = '#FDFAF3';
const HEADING = '#1F1611';
const BODY = '#3D2E22';
const MUTED = '#736051';
const ACCENT = '#0F6743';
const STAR = '#E9775C';
const DIVIDER = '#CBBBA1';
const BAR_TRACK = '#DDD0BC';
const BAR_FILL = '#4F7E63';
const BIO_PREVIEW_LENGTH = 180;

export function ArtisanProfileScreen({
  navigation,
  route,
}: AuthStackScreenProps<'ArtisanProfile'>) {
  const insets = useSafeAreaInsets();
  const artisan = findArtisan(route.params.artisanId);
  const [isFavourite, setFavourite] = useState(false);
  const [isBioExpanded, setBioExpanded] = useState(false);

  if (!artisan) {
    return (
      <View style={[styles.root, styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingText}>This artisan is no longer listed.</Text>
      </View>
    );
  }

  const profile = getArtisanProfile(artisan);
  const isBioLong = profile.bio.length > BIO_PREVIEW_LENGTH;
  const bio =
    isBioExpanded || !isBioLong
      ? profile.bio
      : `${profile.bio.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}...`;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          <View style={styles.heroActions}>
            <CircleButton label="Go back" onPress={navigation.goBack}>
              <ArrowLeftIcon color={HEADING} />
            </CircleButton>
            <View style={styles.heroActionsRight}>
              <CircleButton label="Share profile">
                <ShareIcon />
              </CircleButton>
              <CircleButton
                label={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
                onPress={() => setFavourite(current => !current)}
                selected={isFavourite}
              >
                <HeartIcon
                  color={isFavourite ? STAR : HEADING}
                  filled={isFavourite}
                  size={18}
                />
              </CircleButton>
            </View>
          </View>

          <Image source={artisan.image} style={styles.avatar} />
          <Text style={styles.name}>{artisan.name}</Text>
          <Text style={styles.headline}>{profile.headline}</Text>

          <View style={styles.stats}>
            <Stat label="completed jobs" value={`${profile.completedJobs}`} />
            <View style={styles.statDivider} />
            <Stat label="job experience" value={`${profile.yearsExperience}y`} />
            <View style={styles.statDivider} />
            <Stat
              label="price range"
              value={formatCompactPrice(artisan.priceFrom).replace('+', '')}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon={<StarIcon size={14} />}
            text={`${formatRating(artisan.rating)} (${artisan.reviews} reviews)`}
          />
          <InfoRow
            icon={<MapPinIcon color={BODY} size={14} />}
            text={profile.area}
          />
          <InfoRow icon={<GlobeIcon size={14} />} text={profile.languages} />
        </View>

        <View style={styles.body}>
          <Section title={`About ${artisan.name.split(' ')[0]}`}>
            <Text style={styles.paragraph}>{bio}</Text>
            {isBioLong ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setBioExpanded(current => !current)}
              >
                <Text style={styles.link}>
                  {isBioExpanded ? 'Read less' : 'Read more'}
                </Text>
              </Pressable>
            ) : null}
          </Section>

          <Section title="Skills & Services">
            <BulletList items={profile.skills} />
          </Section>

          <Section action="See all" title="Service Gallery">
            <View style={styles.gallery}>
              {profile.gallery.map((source, index) => (
                <GalleryTile key={index} source={source} />
              ))}
            </View>
          </Section>

          <Section title="Location">
            <View style={styles.map}>
              <Image source={profile.map} style={styles.mapImage} />
              <Pressable
                accessibilityLabel="Expand map"
                accessibilityRole="button"
                style={styles.mapExpand}
              >
                <ExpandIcon />
              </Pressable>
              <View style={styles.mapMarker}>
                <Image source={artisan.image} style={styles.mapMarkerImage} />
                <View style={styles.mapMarkerBadge}>
                  <StarIcon size={8} />
                  <Text style={styles.mapMarkerRating}>
                    {formatRating(artisan.rating)}
                  </Text>
                </View>
              </View>
            </View>
          </Section>

          <Section title="Ratings & Reviews">
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingValue}>
                {formatRating(profile.averageRating)}
              </Text>
              <StarRow rating={profile.averageRating} size={16} />
              <Text style={styles.ratingCount}>
                {profile.totalReviews} reviews
              </Text>
            </View>

            <View style={styles.breakdown}>
              {profile.breakdown.map(row => (
                <BreakdownRow key={row.stars} row={row} total={profile.totalReviews} />
              ))}
            </View>

            <View style={styles.reviewToolbar}>
              <Text style={styles.reviewCount}>
                Showing {profile.reviews.length} of {profile.totalReviews}
              </Text>
              <Text style={styles.link}>Newest ⌄</Text>
            </View>

            <View style={styles.reviewList}>
              {profile.reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.viewAll, pressed && styles.pressed]}
            >
              <Text style={styles.viewAllLabel}>View all</Text>
            </Pressable>
          </Section>

          <Section title="Trust Score & Verification">
            <BulletList items={profile.verification} />
          </Section>

          <Section title="Service Terms">
            <View style={styles.bullets}>
              {profile.terms.map(term => (
                <View key={term.label} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={styles.bulletStrong}>{term.label}: </Text>
                    {term.detail}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.book, pressed && styles.pressed]}
        >
          <Text style={styles.bookLabel}>Book now</Text>
        </Pressable>
      </View>
    </View>
  );
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

function Stat({ value, label }: Readonly<{ value: string; label: string }>) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  text,
}: Readonly<{ icon: React.ReactNode; text: string }>) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function Section({
  title,
  action,
  children,
}: Readonly<{ title: string; action?: string; children: React.ReactNode }>) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action ? <Text style={styles.link}>{action}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function BulletList({ items }: Readonly<{ items: readonly string[] }>) {
  return (
    <View style={styles.bullets}>
      {items.map(item => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function GalleryTile({ source }: Readonly<{ source: ImageSourcePropType }>) {
  return (
    <View style={styles.galleryTile}>
      <Image source={source} style={styles.galleryImage} />
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
        <StarIcon filled={rating >= step - 0.5} key={step} size={size} />
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
    backgroundColor: SURFACE,
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
  },
  content: {
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: TOP_SURFACE,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heroActionsRight: {
    flexDirection: 'row',
    gap: 16,
  },
  circle: {
    alignItems: 'center',
    backgroundColor: 'rgba(166, 147, 118, 0.24)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatar: {
    borderRadius: 50,
    height: 100,
    marginTop: 12,
    width: 100,
  },
  name: {
    color: HEADING,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 16,
  },
  headline: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 22,
    width: '100%',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: HEADING,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  statLabel: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
  },
  statDivider: {
    backgroundColor: DIVIDER,
    width: StyleSheet.hairlineWidth,
  },
  infoCard: {
    backgroundColor: INFO_SURFACE,
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  infoText: {
    color: BODY,
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: HEADING,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  link: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  paragraph: {
    color: BODY,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 10,
  },
  bullets: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletDot: {
    color: BODY,
    fontSize: 12,
    lineHeight: 18,
  },
  bulletText: {
    color: BODY,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  bulletStrong: {
    fontWeight: '700',
  },
  gallery: {
    flexDirection: 'row',
    gap: 16,
  },
  galleryTile: {
    borderRadius: 8,
    flex: 1,
    height: 180,
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
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 3,
    position: 'absolute',
    top: 167,
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
    fontSize: 12,
    lineHeight: 16,
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
    fontSize: 11,
    lineHeight: 15,
    width: 40,
  },
  breakdownTrack: {
    backgroundColor: BAR_TRACK,
    borderRadius: 5,
    flex: 1,
    height: 10,
    overflow: 'hidden',
  },
  breakdownFill: {
    backgroundColor: BAR_FILL,
    borderRadius: 5,
    height: '100%',
  },
  breakdownCount: {
    color: BODY,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'right',
    width: 24,
  },
  reviewToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  reviewCount: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
  },
  reviewList: {
    gap: 12,
    marginTop: 12,
  },
  reviewCard: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    padding: 20,
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
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  reviewMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  reviewAgo: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
  },
  reviewBody: {
    color: BODY,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  viewAll: {
    alignItems: 'center',
    borderColor: ACCENT,
    borderRadius: 6,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    marginTop: 24,
  },
  viewAllLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: SURFACE,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  book: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 6,
    height: 56,
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
