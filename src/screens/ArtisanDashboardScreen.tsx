import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtisanStatCard } from '../components/artisan/ArtisanStatCard';
import { JobRequestCard } from '../components/artisan/JobRequestCard';
import { ProfileReviewCard } from '../components/artisan/ProfileReviewCard';
import { UpcomingRequestCard } from '../components/artisan/UpcomingRequestCard';
import { ChangeLocationModal } from '../components/dashboard/ChangeLocationModal';
import {
  DashboardCard,
  DashboardHeader,
  DashboardShell,
  HEADER_CONTENT_OVERLAP,
  SectionHeader,
} from '../components/dashboard/DashboardShell';
import { WhyBetaWorkSection } from '../components/dashboard/WhyBetaWorkSection';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  EditIcon,
  LockIcon,
  StarIcon,
} from '../components/icons';
import { StarIcon2 } from '../components/icons/StarIcon2';
import {
  ARTISAN_PROFILE_TASKS,
  ARTISAN_STATS,
  ARTISAN_TESTIMONIALS,
  getProfileCompletionPercent,
  isProfileSetupComplete,
  NEW_JOB_REQUESTS,
  UPCOMING_REQUESTS,
  type ArtisanProfileTask,
  type ArtisanReview,
  type JobRequest,
  type UpcomingRequest,
} from '../data/artisanRequests';
import { DEFAULT_LOCATION_LABEL, type SavedAddress } from '../data/locations';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser } from '../store/slices/authSlice';
import { dashboardColors } from '../theme/dashboard';

const LOCKED_PROFILE_TASKS: readonly ArtisanProfileTask[] =
  ARTISAN_PROFILE_TASKS.map(task => ({ ...task, completed: false }));

type ArtisanDashboardScreenProps = Readonly<{
  isVerified: boolean;
}>;

export function ArtisanDashboardScreen({
  isVerified,
}: ArtisanDashboardScreenProps) {
  const user = useAppSelector(selectAuthUser);
  const firstName = user?.firstName?.trim() || 'there';
  const [isLocationPickerOpen, setLocationPickerOpen] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION_LABEL);

  const handleSelectLocation = (address: SavedAddress) => {
    setLocation(address.label);
    setLocationPickerOpen(false);
  };

  const locationProps = {
    location,
    onLocationPress: () => setLocationPickerOpen(true),
  };

  return (
    <>
      {isVerified ? (
        <ApprovedDashboard firstName={firstName} {...locationProps} />
      ) : (
        <UnderReviewDashboard
          firstName={firstName}
          user={user}
          {...locationProps}
        />
      )}
      <ChangeLocationModal
        onClose={() => setLocationPickerOpen(false)}
        onSelect={handleSelectLocation}
        visible={isLocationPickerOpen}
      />
    </>
  );
}

function UnderReviewDashboard({
  firstName,
  location,
  onLocationPress,
  user,
}: Readonly<{
  firstName: string;
  location: string;
  onLocationPress: () => void;
  user: ReturnType<typeof selectAuthUser>;
}>) {
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    'Abigail Anioke';
  const phone = maskPhone(user?.phoneNumber) ?? '0810 *** ****';

  return (
    <DashboardShell
      backgroundColor={dashboardColors.artisanSurface}
      roundedBodyTop={true}
      scrollHeader={
        <DashboardHeader
          firstName={firstName}
          footer={<ProfileReviewCard />}
          location={location}
          onLocationPress={onLocationPress}
          paddingBottom={16 + HEADER_CONTENT_OVERLAP}
          subtitle="Your account is currently under review."
        />
      }
      showTabBar={false}
    >
      <ApprovalChecklist
        tasks={LOCKED_PROFILE_TASKS}
        title="What you can do after approval"
      />

      <DashboardCard style={styles.infoCard}>
        <Text style={styles.infoTitle}>Submitted Information</Text>
        <InfoLine label="Full name" value={fullName} />
        <InfoLine label="Phone number" value={phone} />
        <InfoLine label="Primary skill" value="Electrician" />
        <InfoLine
          label="Address"
          value="23 Abakyari close, wuse, opp Fidelity bank Abuja"
        />
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <EditIcon color={dashboardColors.white} size={16} />
          <Text style={styles.editButtonLabel}>Edit Personal Details</Text>
        </Pressable>
      </DashboardCard>

      <Text style={styles.supportNote}>
        Need help? Contact <Text style={styles.supportLink}>support</Text> if
        your verification {'\n'}takes longer than expected.
      </Text>
    </DashboardShell>
  );
}

function ApprovedDashboard({
  firstName,
  location,
  onLocationPress,
}: Readonly<{
  firstName: string;
  location: string;
  onLocationPress: () => void;
}>) {
  const [profileTasks] = useState(ARTISAN_PROFILE_TASKS);
  const profileComplete = isProfileSetupComplete(profileTasks);
  const completionPercent = getProfileCompletionPercent(profileTasks);
  const onViewRequest = (_request: JobRequest) => {};
  const onViewUpcoming = (_request: UpcomingRequest) => {};

  return (
    <DashboardShell
      backgroundColor={dashboardColors.artisanSurface}
      roundedBodyTop={true}
      scrollHeader={
        <DashboardHeader
          firstName={firstName}
          footer={
            profileComplete ? (
              <AvailabilityPill />
            ) : (
              <ProfileSetupCard completion={completionPercent} />
            )
          }
          location={location}
          onLocationPress={onLocationPress}
          paddingBottom={16 + HEADER_CONTENT_OVERLAP}
          subtitle="Let's make today productive. Here's what's coming up for you."
        />
      }
      showTabBar={false}
    >
      {profileComplete ? null : (
        <ApprovalChecklist
          tasks={profileTasks}
          title="What you can do after approval"
        />
      )}

      <View style={styles.statGrid}>
        {!profileComplete ? null : (
          <View style={styles.statRow}>
            <ArtisanStatCard
              Icon={BriefcaseIcon}
              label="Pending Requests"
              sublabel="Awaiting response"
              value={`${ARTISAN_STATS.pendingRequests}`}
            />
            <ArtisanStatCard
              Icon={<StarIcon2 size={20} />}
              label="Upcoming Jobs"
              sublabel="Scheduled jobs"
              value={`${ARTISAN_STATS.upcomingJobs}`}
            />
          </View>
        )}
        <View style={styles.statRow}>
          <ArtisanStatCard
            Icon={BriefcaseIcon}
            label="Jobs Completed"
            sublabel="Finished jobs"
            value={`${ARTISAN_STATS.jobsCompleted}`}
          />
          <ArtisanStatCard
            Icon={<StarIcon2 size={20} />}
            label="Current Rating"
            sublabel={`${ARTISAN_STATS.reviews} Reviews`}
            value={ARTISAN_STATS.rating}
          />
        </View>
      </View>

      <View style={styles.section}>
        {NEW_JOB_REQUESTS.length > 0 ? (
          <>
            <SectionHeader actionLabel="See all" title="New job request" />
            <View style={styles.list}>
              {NEW_JOB_REQUESTS.map(request => (
                <JobRequestCard
                  key={request.id}
                  onViewDetails={onViewRequest}
                  request={request}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>New job request</Text>
            <DashboardCard style={styles.emptyRequestCard}>
              <CalendarIcon color="#A38D75" size={40} />
              <Text style={styles.emptyTitle}>No activity yet</Text>
              <Text style={styles.emptyBody}>
                Your new requests will appear here once you complete your
                profile
              </Text>
            </DashboardCard>
          </>
        )}
      </View>

      {UPCOMING_REQUESTS.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader actionLabel="See all" title="Upcoming requests" />
          <View style={styles.list}>
            {UPCOMING_REQUESTS.map(request => (
              <UpcomingRequestCard
                key={request.id}
                onViewDetails={onViewUpcoming}
                request={request}
              />
            ))}
          </View>
        </View>
      ) : null}

      <WhyBetaWorkSection subtitle="Discover how we make finding trusted artisans simple and reliable." />

      <TestimonialSection review={ARTISAN_TESTIMONIALS[0]} />
    </DashboardShell>
  );
}

function ApprovalChecklist({
  title,
  tasks,
}: Readonly<{ title: string; tasks: readonly ArtisanProfileTask[] }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <DashboardCard style={styles.checklistCard}>
        {tasks.map(task => (
          <View key={task.id} style={styles.checklistRow}>
            {task.completed ? (
              <CheckCircleIcon color={dashboardColors.textHelper} size={18} />
            ) : (
              <LockIcon color={dashboardColors.textHelper} size={16} />
            )}
            <Text style={styles.checklistText}>{task.label}</Text>
          </View>
        ))}
      </DashboardCard>
    </View>
  );
}

function ProfileSetupCard({ completion }: Readonly<{ completion: number }>) {
  return (
    <View style={styles.setupCard}>
      <Text style={styles.setupTitle}>Complete your profile setup!</Text>
      <Text style={styles.setupBody}>
        Add your portfolio to get 5x more job invitations.
      </Text>
      <Text style={styles.progressValue}>{completion}%</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${completion}%` }]} />
      </View>
    </View>
  );
}

function AvailabilityPill() {
  return (
    <View style={styles.availabilityPill}>
      <View style={styles.availabilityDot} />
      <Text style={styles.availabilityLabel}>Available</Text>
    </View>
  );
}

function TestimonialSection({ review }: Readonly<{ review: ArtisanReview }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        What users are saying about the Beta App
      </Text>
      <DashboardCard style={styles.testimonialCard}>
        <View style={styles.testimonialHeader}>
          <Image source={review.avatar} style={styles.testimonialAvatar} />
          <Text style={styles.testimonialAuthor}>
            {review.author}, {review.area}
          </Text>
        </View>
        <View style={styles.testimonialMeta}>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(step => (
              <StarIcon filled={review.rating >= step} key={step} size={12} />
            ))}
          </View>
          <Text style={styles.testimonialAgo}>{review.postedAgo}</Text>
        </View>
        <Text style={styles.testimonialBody}>{review.body}</Text>
      </DashboardCard>
    </View>
  );
}

function InfoLine({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <Text style={styles.infoValue}>
      <Text style={styles.infoLabel}>{label}: </Text>
      {value}
    </Text>
  );
}

/** "08103334444" -> "0810 *** ****", keeping the first 4 digits. */
function maskPhone(phone?: string): string | null {
  if (!phone) {
    return null;
  }
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 4) {
    return null;
  }
  return `${digits.slice(0, 4)} *** ****`;
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginTop: 12,
  },
  sectionTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  checklistCard: {
    gap: 16,
  },
  checklistRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  checklistText: {
    color: dashboardColors.textPrimary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    gap: 16,
  },
  infoTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  infoLabel: {
    fontWeight: '400',
  },
  infoValue: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400',
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.tabBar,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
  },
  editButtonLabel: {
    color: dashboardColors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  supportNote: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  supportLink: {
    color: dashboardColors.tabBar,
    fontWeight: '700',
  },
  setupCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    borderColor: dashboardColors.headerBorder,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 6,
    padding: 16,
  },
  setupTitle: {
    color: dashboardColors.white,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  setupBody: {
    color: dashboardColors.headerSubtitle,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 18,
  },
  progressTrack: {
    backgroundColor: dashboardColors.progressTrack,
    borderRadius: 6,
    flex: 1,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: dashboardColors.progressFill,
    borderRadius: 6,
    height: '100%',
  },
  progressValue: {
    color: dashboardColors.white,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'right',
  },
  availabilityPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17, 140, 87, 0.2)',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  availabilityDot: {
    backgroundColor: dashboardColors.progressFill,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  availabilityLabel: {
    color: dashboardColors.white,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  statGrid: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyRequestCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 28,
  },
  emptyTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  emptyBody: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  testimonialCard: {
    gap: 10,
  },
  testimonialHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  testimonialAvatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  testimonialAuthor: {
    color: dashboardColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  testimonialMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialAgo: {
    color: dashboardColors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  testimonialBody: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
