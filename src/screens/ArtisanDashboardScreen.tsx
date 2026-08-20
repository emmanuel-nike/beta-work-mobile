import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  DashboardCard,
  DashboardHeader,
  DashboardShell,
  SectionHeader,
} from '../components/dashboard/DashboardShell';
import { BriefcaseIcon, LockIcon } from '../components/icons';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/authSlice';
import { dashboardColors } from '../theme/dashboard';

type ArtisanDashboardScreenProps = Readonly<{
  isVerified: boolean;
}>;

export function ArtisanDashboardScreen({ isVerified }: ArtisanDashboardScreenProps) {
  const user = useAppSelector(selectAuthUser);
  const firstName = user?.firstName?.trim() || 'there';

  if (!isVerified) {
    return (
      <DashboardShell
        activeTab="home"
        backgroundColor={dashboardColors.artisanSurface}
        contentStyle={styles.mainContent}
        header={
          <View>
            <DashboardHeader
              firstName={firstName}
              height={360}
              subtitle="Your account is currently under review."
            />
            <View style={styles.headerCardWrap}>
              <ReviewStatusCard />
            </View>
          </View>
        }
        tabsDisabled>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you can do after approval</Text>
          <DashboardCard style={styles.approvalListCard}>
            <LockedFeatureItem text="Add services you offer" />
            <LockedFeatureItem text="Receive and respond to job requests" />
            <LockedFeatureItem text="Build your reputation with reviews" />
            <LockedFeatureItem text="Track earnings and payouts" />
          </DashboardCard>
        </View>
        <Pressable accessibilityRole="button" style={styles.supportButton}>
          <Text style={styles.supportButtonLabel}>Contact support</Text>
        </Pressable>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      activeTab="home"
      backgroundColor={dashboardColors.artisanSurface}
      contentStyle={styles.mainContent}
      header={
        <View>
          <DashboardHeader firstName={firstName} height={360} />
          <View style={styles.headerCardWrap}>
            <ProfileSetupCard />
          </View>
        </View>
      }>
      <DashboardCard style={styles.statsCard}>
        <View style={styles.statsRow}>
          <StatItem label="Active jobs" value="0" />
          <View style={styles.statDivider} />
          <StatItem label="Completed" value="0" />
          <View style={styles.statDivider} />
          <StatItem label="Rating" value="—" />
        </View>
      </DashboardCard>

      <View style={styles.section}>
        <SectionHeader title="Job requests" />
        <DashboardCard style={styles.emptyStateCard}>
          <View style={styles.emptyIconWrap}>
            <BriefcaseIcon />
          </View>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyBody}>
            Complete your profile and add portfolio photos to start receiving job
            invitations from nearby customers.
          </Text>
          <Pressable accessibilityRole="button" style={styles.outlineButton}>
            <Text style={styles.outlineButtonLabel}>Complete profile</Text>
          </Pressable>
        </DashboardCard>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Grow your business" />
        <DashboardCard style={styles.tipHeroCard}>
          <Image
            source={require('../../assets/images/dashboard/image0_676_87466.png')}
            style={styles.tipHeroImage}
          />
          <View style={styles.tipHeroCopy}>
            <Text style={styles.tipHeroTitle}>Show your best work</Text>
            <Text style={styles.tipHeroBody}>
              Artisans with portfolio photos get up to 5x more invitations.
            </Text>
          </View>
        </DashboardCard>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Tips for artisans" />
        <DashboardCard style={styles.tipsListCard}>
          <TipRow
            body="Respond within 2 hours to rank higher in search results."
            title="Reply quickly"
          />
          <TipRow
            body="Keep your availability updated so customers know when to book you."
            title="Stay available"
          />
        </DashboardCard>
      </View>
    </DashboardShell>
  );
}

function ReviewStatusCard() {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewAccent} />
      <View style={styles.reviewIconWrap}>
        <LockIcon />
      </View>
      <View style={styles.reviewCopy}>
        <Text style={styles.reviewTitle}>Your profile is under review</Text>
        <Text style={styles.reviewBody}>Verification usually takes 24–48 hours.</Text>
      </View>
    </View>
  );
}

function ProfileSetupCard() {
  return (
    <View style={styles.setupCard}>
      <Text style={styles.setupTitle}>Complete your profile setup!</Text>
      <Text style={styles.setupBody}>
        Add your portfolio to get 5x more job invitations.
      </Text>
      <View style={styles.progressMeta}>
        <Text style={styles.progressLabel}>Profile completion</Text>
        <Text style={styles.progressValue}>70%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
    </View>
  );
}

function LockedFeatureItem({ text }: Readonly<{ text: string }>) {
  return (
    <View style={styles.lockedItem}>
      <View style={styles.lockedIconWrap}>
        <LockIcon color={dashboardColors.textHelper} size={16} />
      </View>
      <Text style={styles.lockedText}>{text}</Text>
    </View>
  );
}

function StatItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TipRow({ body, title }: Readonly<{ body: string; title: string }>) {
  return (
    <View style={styles.tipRow}>
      <Text style={styles.tipRowTitle}>{title}</Text>
      <Text style={styles.tipRowBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCardWrap: {
    marginTop: -56,
    paddingHorizontal: 24,
  },
  mainContent: {
    paddingTop: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  reviewCard: {
    backgroundColor: dashboardColors.card,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    padding: 16,
    paddingLeft: 20,
  },
  reviewAccent: {
    backgroundColor: dashboardColors.accentGold,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 8,
  },
  reviewIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(229, 161, 31, 0.16)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  reviewCopy: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  reviewTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  reviewBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  approvalListCard: {
    gap: 16,
  },
  lockedItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  lockedIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(105, 81, 57, 0.08)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  lockedText: {
    color: dashboardColors.textPrimary,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  supportButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.tabBar,
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
  },
  supportButtonLabel: {
    color: dashboardColors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
  },
  setupCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    borderColor: dashboardColors.headerBorder,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 8,
    padding: 16,
  },
  setupTitle: {
    color: dashboardColors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  setupBody: {
    color: dashboardColors.headerSubtitle,
    fontSize: 14,
    lineHeight: 21,
  },
  progressMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    color: dashboardColors.headerSubtitle,
    fontSize: 12,
    lineHeight: 16,
  },
  progressValue: {
    color: dashboardColors.white,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  progressTrack: {
    backgroundColor: dashboardColors.progressTrack,
    borderRadius: 6,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: dashboardColors.progressFill,
    borderRadius: 6,
    height: '100%',
    width: '67%',
  },
  statsCard: {
    paddingVertical: 20,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
  },
  statLabel: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  statDivider: {
    backgroundColor: dashboardColors.category,
    height: 40,
    width: 1,
  },
  emptyStateCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  emptyIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 103, 67, 0.08)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 4,
    width: 56,
  },
  emptyTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  emptyBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  outlineButton: {
    borderColor: dashboardColors.tabBar,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  outlineButtonLabel: {
    color: dashboardColors.tabBar,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
  },
  tipHeroCard: {
    overflow: 'hidden',
    padding: 0,
  },
  tipHeroImage: {
    height: 140,
    width: '100%',
  },
  tipHeroCopy: {
    gap: 6,
    padding: 16,
  },
  tipHeroTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  tipHeroBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  tipsListCard: {
    gap: 16,
  },
  tipRow: {
    gap: 4,
  },
  tipRowTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  tipRowBody: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
