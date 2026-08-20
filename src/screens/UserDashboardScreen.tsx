import {
  Image,
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
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/authSlice';
import { dashboardColors } from '../theme/dashboard';

const CATEGORY_ITEMS = [
  { id: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'hair', label: 'Hair', emoji: '💇🏽‍♀️' },
  { id: 'electrical', label: 'Electrical', emoji: '⚡️' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
] as const;

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

  return (
    <DashboardShell
      contentStyle={styles.content}
      scrollHeader={
        <DashboardHeader
          firstName={firstName}
          footer={<SearchBar />}
          subtitle="What do you need help with today?"
        />
      }
    >
      <View style={styles.section}>
        <ScrollView
          contentContainerStyle={styles.categoryRow}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
        >
          {CATEGORY_ITEMS.map((category, index) => (
            <CategoryChip
              key={category.id}
              emoji={category.emoji}
              label={category.label}
              selected={index === 0}
            />
          ))}
        </ScrollView>
      </View>

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
    </DashboardShell>
  );
}

function CategoryChip({
  emoji,
  label,
  selected,
}: Readonly<{ emoji: string; label: string; selected?: boolean }>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.categoryChip, selected && styles.categoryChipSelected]}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text
        style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

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
  categoryRow: {
    gap: 12,
    paddingRight: 24,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: dashboardColors.category,
    borderRadius: 10,
    height: 79,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: 80,
  },
  categoryChipSelected: {
    backgroundColor: dashboardColors.white,
  },
  categoryEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  categoryLabel: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: dashboardColors.textPrimary,
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
