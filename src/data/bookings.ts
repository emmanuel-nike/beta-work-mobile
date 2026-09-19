import type { ImageSourcePropType } from 'react-native';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export type BookingFilter = 'all' | BookingStatus;

export type TimelineState = 'done' | 'active' | 'pending' | 'cancelled';

export type TimelineStep = Readonly<{
  id: string;
  label: string;
  state: TimelineState;
  date?: string;
  time?: string;
}>;

export type Booking = Readonly<{
  id: string;
  status: BookingStatus;
  artisanName: string;
  /** Shown on the list card, e.g. "Plumber". */
  trade: string;
  /** Longer form shown on the details screen, e.g. "Plumber & Pipefitter". */
  tradeFull: string;
  avatar: ImageSourcePropType;
  rating: string;
  reviewCount: string;
  distance: string;
  dateTime: string;
  /** Short address used on the list card. */
  location: string;
  /** Full address used on the details screen. */
  address: string;
  service: string;
  languages: string;
  jobDescription: string;
  budget: string;
  messageToArtisan: string;
  timeline: readonly TimelineStep[];
  /** Ongoing jobs only: the artisan has reported the work as finished. */
  awaitingConfirmation?: boolean;
  cancellation?: Readonly<{
    cancelledBy: string;
    reason: string;
    cancelledAt: string;
  }>;
}>;

const PLUMBER = require('../../assets/images/dashboard/image0_1174_145674.png');
const STYLIST = require('../../assets/images/dashboard/image1_1174_145674.png');
const NAIL_TECH = require('../../assets/images/dashboard/image2_1174_145674.png');

type StepSeed = Readonly<{ state: TimelineState; date?: string; time?: string }>;

const STEP_LABELS = [
  'Request sent',
  'Artisan reviewing',
  'Job accepted',
  'Job ongoing',
  'Job completed',
] as const;

const STEP_IDS = [
  'request-sent',
  'artisan-reviewing',
  'job-accepted',
  'job-ongoing',
  'job-completed',
] as const;

function buildTimeline(seeds: readonly StepSeed[]): readonly TimelineStep[] {
  return STEP_IDS.map((id, index) => ({
    id,
    label: STEP_LABELS[index],
    ...seeds[index],
  }));
}

/**
 * A cancelled job replaces the third step with the cancellation itself, so the
 * remaining steps never happened.
 */
function buildCancelledTimeline(
  seeds: readonly StepSeed[],
): readonly TimelineStep[] {
  return buildTimeline(seeds).map(step =>
    step.id === 'job-accepted'
      ? { ...step, label: 'Job canceled' }
      : step,
  );
}

export const BOOKINGS: readonly Booking[] = [
  {
    id: 'bk-1001',
    status: 'pending',
    artisanName: 'Tunde Ehinde',
    trade: 'Plumber',
    tradeFull: 'Plumber & Pipefitter',
    avatar: PLUMBER,
    rating: '3.2',
    reviewCount: '102',
    distance: '4.2 km away',
    dateTime: 'Nov 21 • 11:00 AM',
    location: '41 Amino crescent wood, wuse 2.',
    address: '145 Adetokunbo Ademola Crescent',
    service: 'Pipe repair and replacement',
    languages: 'English and Yoruba',
    jobDescription:
      'Slow draining in the kitchen sink, possibly due to a blockage, and a persistent drip in the guest bathroom faucet.',
    budget: '₦40,000',
    messageToArtisan: 'Please call me when you get to the bus stop',
    timeline: buildTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'active' },
      { state: 'pending' },
      { state: 'pending' },
      { state: 'pending' },
    ]),
  },
  {
    id: 'bk-1002',
    status: 'accepted',
    artisanName: 'Mariam Suleiman',
    trade: 'Makeup artist',
    tradeFull: 'Makeup artist & Braider',
    avatar: STYLIST,
    rating: '3.7',
    reviewCount: '84',
    distance: '3.1 km away',
    dateTime: 'Nov 15 • 11:00 AM',
    location: '41 Amino crescent wood, wuse 2.',
    address: '145 Adetokunbo Ademola Crescent',
    service: 'Corn rows braiding',
    languages: 'English and Hausa',
    jobDescription:
      'Full corn rows with extensions for a weekend wedding. Please bring your own hair dryer.',
    budget: '₦25,000',
    messageToArtisan: 'The gate code is 4402, ring the bell twice.',
    timeline: buildTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'done', date: '12th Nov, 2025', time: '12:00 PM' },
      { state: 'done', date: '12th Nov, 2025', time: '4:03 PM' },
      { state: 'pending' },
      { state: 'pending' },
    ]),
  },
  {
    id: 'bk-1003',
    status: 'completed',
    artisanName: 'Favour Sang',
    trade: 'Makeup artist',
    tradeFull: 'Nail technician',
    avatar: NAIL_TECH,
    rating: '3.7',
    reviewCount: '56',
    distance: '3.1 km away',
    dateTime: 'Nov 12 • 1:00 PM',
    location: '21 east west side, new nyanya.',
    address: '21 East West Side, New Nyanya',
    service: 'Nail technician',
    languages: 'English',
    jobDescription:
      'Acrylic refill with a simple french design on both hands.',
    budget: '₦18,000',
    messageToArtisan: 'I will be home from noon.',
    timeline: buildTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'done', date: '12th Nov, 2025', time: '12:00 PM' },
      { state: 'done', date: '12th Nov, 2025', time: '4:03 PM' },
      { state: 'done', date: '13th Nov, 2025', time: '08:18 AM' },
      { state: 'done', date: '29th Nov, 2025', time: '06:00 PM' },
    ]),
  },
  {
    id: 'bk-1004',
    status: 'cancelled',
    artisanName: 'Tunde Ehinde',
    trade: 'Plumber',
    tradeFull: 'Plumber & Pipefitter',
    avatar: PLUMBER,
    rating: '3.2',
    reviewCount: '102',
    distance: '4.2 km away',
    dateTime: 'Nov 21 • 11:00 AM',
    location: '41 Amino crescent wood, wuse 2.',
    address: '145 Adetokunbo Ademola Crescent',
    service: 'Pipe repair and replacement',
    languages: 'English and Yoruba',
    jobDescription:
      'Slow draining in the kitchen sink, possibly due to a blockage, and a persistent drip in the guest bathroom faucet.',
    budget: '₦40,000',
    messageToArtisan: 'Please call me when you get to the bus stop',
    timeline: buildCancelledTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'done', date: '12th Nov, 2025', time: '12:00 PM' },
      { state: 'cancelled', date: '12th Nov, 2025', time: '6:00 PM' },
      { state: 'pending' },
      { state: 'pending' },
    ]),
    cancellation: {
      cancelledBy: 'Tunde',
      reason: "I'm not available on date",
      cancelledAt: '12 Nov 2025, 11:22 AM',
    },
  },
  {
    id: 'bk-1005',
    status: 'ongoing',
    artisanName: 'Mariam Suleiman',
    trade: 'Makeup artist',
    tradeFull: 'Makeup artist & Braider',
    avatar: STYLIST,
    rating: '3.7',
    reviewCount: '84',
    distance: '3.1 km away',
    dateTime: 'Nov 21 • 11:00 AM',
    location: '41 Amino crescent wood, wuse 2.',
    address: '145 Adetokunbo Ademola Crescent',
    service: 'Corn rows braiding',
    languages: 'English and Hausa',
    jobDescription:
      'Full corn rows with extensions for a weekend wedding. Please bring your own hair dryer.',
    budget: '₦25,000',
    messageToArtisan: 'The gate code is 4402, ring the bell twice.',
    timeline: buildTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'done', date: '12th Nov, 2025', time: '12:00 PM' },
      { state: 'done', date: '12th Nov, 2025', time: '4:03 PM' },
      { state: 'active' },
      { state: 'pending' },
    ]),
  },
  {
    id: 'bk-1006',
    status: 'ongoing',
    artisanName: 'Favour Sang',
    trade: 'Makeup artist',
    tradeFull: 'Nail technician',
    avatar: NAIL_TECH,
    rating: '3.7',
    reviewCount: '56',
    distance: '3.1 km away',
    dateTime: 'Nov 12 • 1:00 PM',
    location: '21 east west side, new nyanya.',
    address: '21 East West Side, New Nyanya',
    service: 'Nail technician',
    languages: 'English',
    jobDescription:
      'Acrylic refill with a simple french design on both hands.',
    budget: '₦18,000',
    messageToArtisan: 'I will be home from noon.',
    awaitingConfirmation: true,
    timeline: buildTimeline([
      { state: 'done', date: '12th Nov, 2025', time: '08:32 AM' },
      { state: 'done', date: '12th Nov, 2025', time: '12:00 PM' },
      { state: 'done', date: '12th Nov, 2025', time: '4:03 PM' },
      { state: 'done', date: '13th Nov, 2025', time: '08:18 AM' },
      { state: 'active' },
    ]),
  },
];

export const BOOKING_FILTERS: ReadonlyArray<{
  id: BookingFilter;
  label: string;
}> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function filterBookings(
  bookings: readonly Booking[],
  filter: BookingFilter,
): readonly Booking[] {
  return filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);
}

export function findBooking(id: string): Booking | undefined {
  return BOOKINGS.find(booking => booking.id === id);
}
