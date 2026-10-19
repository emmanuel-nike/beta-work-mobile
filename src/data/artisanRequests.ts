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

export type ArtisanStats = Readonly<{
  pendingRequests: number;
  upcomingJobs: number;
  jobsCompleted: number;
  rating: string;
  reviews: number;
}>;

const CLIENT_A = require('../../assets/images/dashboard/image0_1174_145674.png');
const CLIENT_B = require('../../assets/images/dashboard/image1_1174_145674.png');
const CLIENT_C = require('../../assets/images/dashboard/image1_676_87466.png');

export const ARTISAN_STATS: ArtisanStats = {
  pendingRequests: 4,
  upcomingJobs: 8,
  jobsCompleted: 14,
  rating: '4.9',
  reviews: 14,
};

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

/**
 * Build the profile-setup checklist from the artisan's saved portfolio plus
 * whether they have received a job request yet. Each task is marked complete
 * from real data so the dashboard reflects actual progress.
 */
export function buildArtisanProfileTasks(
  profile: ArtisanProfileData | null,
  hasJobRequest: boolean,
): ArtisanProfileTask[] {
  const hasServices =
    Boolean(profile?.bio) || (profile?.additionalServices?.length ?? 0) > 0;
  const hasPortfolioImages = (profile?.portfolioImages?.length ?? 0) > 0;
  const hasPricing = (profile?.servicePricing?.length ?? 0) > 0;

  return [
    { id: 'add-services', label: 'Add services you offer', completed: hasServices },
    {
      id: 'upload-portfolio',
      label: 'Upload pictures of past work',
      completed: hasPortfolioImages,
    },
    {
      id: 'set-pricing',
      label: 'Set pricing and job duration',
      completed: hasPricing,
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
  return tasks.length > 0 && tasks.every(task => task.completed);
}
