import type { ImageSourcePropType } from 'react-native';

import type { ArtisanProfileData } from '../api/artisan';

export type JobRequestStatus = 'new' | 'pending';

export type JobRequest = Readonly<{
  id: string;
  trade: string;
  clientName: string;
  avatar: ImageSourcePropType;
  distance: string;
  /** Pre-formatted budget, e.g. "₦20k". Omitted when the request is pending. */
  price?: string;
  status: JobRequestStatus;
  dateTime: string;
  location: string;
  service: string;
}>;

export type UpcomingRequest = Readonly<{
  id: string;
  trade: string;
  clientName: string;
  avatar: ImageSourcePropType;
  location: string;
  schedule: string;
}>;

export type ArtisanReview = Readonly<{
  id: string;
  author: string;
  area: string;
  rating: number;
  postedAgo: string;
  body: string;
  avatar: ImageSourcePropType;
}>;

const CLIENT_A = require('../../assets/images/dashboard/image0_1174_145674.png');
const CLIENT_B = require('../../assets/images/dashboard/image1_1174_145674.png');
const CLIENT_C = require('../../assets/images/dashboard/image1_676_87466.png');

export const NEW_JOB_REQUESTS: readonly JobRequest[] = [];

export const UPCOMING_REQUESTS: readonly UpcomingRequest[] = [
  {
    id: 'up-1',
    trade: 'Electrician',
    clientName: 'Uchenna Edeh',
    avatar: CLIENT_A,
    location: 'Maitaima, 4.2km away from you',
    schedule: 'Today, 4:00 PM',
  },
  {
    id: 'up-2',
    trade: 'Electrician',
    clientName: 'Uchenna Edeh',
    avatar: CLIENT_C,
    location: 'Maitaima, 4.2km away from you',
    schedule: 'Today, 4:00 PM',
  },
];

export const ARTISAN_TESTIMONIALS: readonly ArtisanReview[] = [
  {
    id: 'at-1',
    author: 'Chinwe',
    area: 'Jabi',
    rating: 5,
    postedAgo: '2 days ago',
    body: 'Great app! I needed a services, and I quickly found a verified plumber for an urgent job. Booking was easy, and Peter was excellent. Highly recommend!',
    avatar: CLIENT_B,
  },
];

export type ArtisanProfileTask = Readonly<{
  id: string;
  label: string;
  completed: boolean;
}>;

/**
 * Seeded profile-setup tasks. Replace with the artisan profile API response
 * when that endpoint is wired up.
 */
export const ARTISAN_PROFILE_TASKS: readonly ArtisanProfileTask[] = [
  { id: 'add-services', label: 'Add services you offer', completed: true },
  {
    id: 'upload-portfolio',
    label: 'Upload pictures of past work',
    completed: true,
  },
  {
    id: 'set-pricing',
    label: 'Set pricing and job duration',
    completed: false,
  },
  {
    id: 'receive-requests',
    label: 'Start receiving job requests',
    completed: false,
  },
];

/** Checklist rows that make up profile setup. A job request is separate. */
const PROFILE_SETUP_TASK_IDS = [
  'add-services',
  'upload-portfolio',
  'set-pricing',
] as const;

function hasServicesOffered(profile: ArtisanProfileData | null): boolean {
  if (!profile) {
    return false;
  }
  if (profile.trade.trim().length > 0) {
    return true;
  }
  if ((profile.additionalServices?.length ?? 0) > 0) {
    return true;
  }
  return (profile.servicePricing ?? []).some(row => row.service.trim().length > 0);
}

function hasPricingAndDuration(profile: ArtisanProfileData | null): boolean {
  if (!profile) {
    return false;
  }
  const hasPricing = (profile.servicePricing ?? []).some(
    row =>
      row.service.trim().length > 0 &&
      row.minPrice != null &&
      row.maxPrice != null,
  );
  const hasDuration =
    profile.minimumLeadTimeHours != null ||
    hasWorkingSchedule(profile.weeklySchedule);
  return hasPricing && hasDuration;
}

function hasWorkingSchedule(
  schedule: ArtisanProfileData['weeklySchedule'],
): boolean {
  if (!schedule) {
    return false;
  }
  return Object.values(schedule).some(
    day =>
      Boolean(day?.enabled) &&
      day.start.trim().length > 0 &&
      day.end.trim().length > 0,
  );
}

/**
 * Build the profile-setup checklist from the artisan's saved portfolio plus
 * whether they have received a job request yet. Each task is marked complete
 * from real data so the dashboard reflects actual progress.
 */
export function buildArtisanProfileTasks(
  profile: ArtisanProfileData | null,
  hasJobRequest: boolean,
): ArtisanProfileTask[] {
  return [
    {
      id: 'add-services',
      label: 'Add services you offer',
      completed: hasServicesOffered(profile),
    },
    {
      id: 'upload-portfolio',
      label: 'Upload pictures of past work',
      completed: (profile?.portfolioImages?.length ?? 0) > 0,
    },
    {
      id: 'set-pricing',
      label: 'Set pricing and job duration',
      completed: hasPricingAndDuration(profile),
    },
    {
      id: 'receive-requests',
      label: 'Start receiving job requests',
      completed: hasJobRequest,
    },
  ];
}

export function getProfileCompletionPercent(
  tasks: readonly ArtisanProfileTask[],
): number {
  if (tasks.length === 0) {
    return 0;
  }
  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function isProfileSetupComplete(
  tasks: readonly ArtisanProfileTask[],
): boolean {
  const setupTasks = tasks.filter(task =>
    PROFILE_SETUP_TASK_IDS.some(id => id === task.id),
  );
  return setupTasks.length > 0 && setupTasks.every(task => task.completed);
}
