import type { ImageSourcePropType } from 'react-native';

import { toAbsoluteMediaUrl } from '../config/env';
import type {
  Booking,
  BookingStatus,
  TimelineState,
  TimelineStep,
} from '../data/bookings';
import { apiRequest } from './client';

/** Shown until the artisan's photo loads (or when they have none). */
const FALLBACK_AVATAR: ImageSourcePropType = require('../../assets/images/dashboard/image0_1174_145674.png');

/** The booking shape returned by `GET /api/v1/bookings`. */
type ApiBooking = Readonly<{
  id: number;
  status: BookingStatus;
  trade: string;
  service: string;
  jobDescription: string | null;
  budget: number | null;
  languages: string | null;
  messageToArtisan: string | null;
  scheduledAt: string | null;
  location: string | null;
  address: string | null;
  awaitingConfirmation: boolean;
  cancelledBy: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
  artisan: Readonly<{
    id: number;
    name: string | null;
    trade: string;
    photoUrl: string | null;
    rating: number;
    reviewsCount: number;
    distanceKm: number;
  }>;
}>;

/** Fetch the authenticated client's bookings, mapped to the UI booking shape. */
export async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await apiRequest<{ data: ApiBooking[] }>('/bookings', {
    method: 'GET',
  });
  return data.map(toBooking);
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format an ISO timestamp as "Nov 21 • 11:00 AM" without relying on Intl. */
function formatDateTime(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const hours24 = date.getHours();
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month} ${day} • ${hours12}:${minutes} ${meridiem}`;
}

/** "12 Nov 2025, 11:22 AM" for the cancellation line. */
function formatLongDateTime(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const time = formatDateTime(iso).split(' • ')[1] ?? '';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${time}`;
}

function formatBudget(amount: number | null): string {
  if (amount === null || amount === undefined) {
    return '';
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}

const STEP_IDS = [
  'request-sent',
  'artisan-reviewing',
  'job-accepted',
  'job-ongoing',
  'job-completed',
] as const;

const STEP_LABELS = [
  'Request sent',
  'Artisan reviewing',
  'Job accepted',
  'Job ongoing',
  'Job completed',
] as const;

/**
 * Derive the 5-step progress timeline from the booking's status. The backend
 * stores status (and cancellation), and the client renders the stepper, so the
 * per-step states are reconstructed here to match the existing UI.
 */
function timelineForStatus(api: ApiBooking): readonly TimelineStep[] {
  const states = stepStates(api);
  const cancelledIndex = states.indexOf('cancelled');

  return STEP_IDS.map((id, index) => ({
    id,
    label:
      cancelledIndex === index ? 'Job canceled' : STEP_LABELS[index],
    state: states[index],
  }));
}

function stepStates(api: ApiBooking): TimelineState[] {
  switch (api.status) {
    case 'pending':
      return ['done', 'active', 'pending', 'pending', 'pending'];
    case 'accepted':
      return ['done', 'done', 'done', 'pending', 'pending'];
    case 'ongoing':
      return api.awaitingConfirmation
        ? ['done', 'done', 'done', 'done', 'active']
        : ['done', 'done', 'done', 'active', 'pending'];
    case 'completed':
      return ['done', 'done', 'done', 'done', 'done'];
    case 'cancelled':
      return ['done', 'done', 'cancelled', 'pending', 'pending'];
    default:
      return ['pending', 'pending', 'pending', 'pending', 'pending'];
  }
}

function toBooking(api: ApiBooking): Booking {
  const photo = toAbsoluteMediaUrl(api.artisan.photoUrl);
  const avatar: ImageSourcePropType = photo ? { uri: photo } : FALLBACK_AVATAR;

  return {
    id: String(api.id),
    status: api.status,
    artisanName: api.artisan.name ?? 'Artisan',
    trade: api.trade,
    tradeFull: api.artisan.trade || api.trade,
    avatar,
    rating: (api.artisan.rating ?? 0).toFixed(1),
    reviewCount: String(api.artisan.reviewsCount ?? 0),
    distance: `${api.artisan.distanceKm} km away`,
    dateTime: formatDateTime(api.scheduledAt),
    location: api.location ?? '',
    address: api.address ?? '',
    service: api.service,
    languages: api.languages ?? '',
    jobDescription: api.jobDescription ?? '',
    budget: formatBudget(api.budget),
    messageToArtisan: api.messageToArtisan ?? '',
    timeline: timelineForStatus(api),
    awaitingConfirmation: api.awaitingConfirmation || undefined,
    cancellation:
      api.status === 'cancelled' && api.cancelledBy
        ? {
            cancelledBy: api.cancelledBy,
            reason: api.cancellationReason ?? '',
            cancelledAt: formatLongDateTime(api.cancelledAt),
          }
        : undefined,
  };
}
