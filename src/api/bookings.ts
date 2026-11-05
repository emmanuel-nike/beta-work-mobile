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

/** One status-timeline stage as returned by the API. */
type ApiTimelineStep = Readonly<{
  key: string;
  label: string;
  state: TimelineState;
  detail: string;
  /** ISO timestamp for the stage event, when known. */
  at: string | null;
}>;

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
  latitude: number | null;
  longitude: number | null;
  awaitingConfirmation: boolean;
  cancelledBy: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
  /** Status timeline built by the backend; absent on older responses. */
  timeline?: readonly ApiTimelineStep[];
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

/** The fields the client submits to request a booking. */
export type CreateBookingInput = Readonly<{
  /** Public artisan profile id (from `GET /artisans/:id`). */
  artisanProfileId: number;
  service: string;
  jobDescription: string;
  /** ISO timestamp of the requested slot, or null when unset. */
  scheduledAt: string | null;
  location: string | null;
  /** GPS coordinates of the service location, when captured. */
  latitude: number | null;
  longitude: number | null;
  budget: number | null;
  messageToArtisan: string | null;
}>;

/** Create a booking request for an artisan; returns the created booking. */
export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  const { booking } = await apiRequest<{ booking: ApiBooking }>('/bookings', {
    method: 'POST',
    body: input,
  });
  return toBooking(booking);
}

/** Editable fields of a booking; the artisan cannot be changed. */
export type UpdateBookingInput = Omit<CreateBookingInput, 'artisanProfileId'>;

/** Edit an existing (pending) booking; returns the updated booking. */
export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<Booking> {
  const { booking } = await apiRequest<{ booking: ApiBooking }>(
    `/bookings/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: input },
  );
  return toBooking(booking);
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

/** Map the backend-provided status timeline to the UI step shape. */
function timelineFromApi(
  steps: readonly ApiTimelineStep[],
): readonly TimelineStep[] {
  return steps.map(step => ({
    id: step.key,
    label: step.label,
    state: step.state,
    detail: step.detail || undefined,
    ...stepStamp(step.at),
  }));
}

/**
 * Fallback timeline reconstruction for responses without a `timeline` (older
 * backends). Derives the 5 per-step states from the booking status to match the
 * existing UI; the backend is otherwise the source of truth via timelineFromApi.
 */
function timelineForStatus(api: ApiBooking): readonly TimelineStep[] {
  const states = stepStates(api);
  const cancelledIndex = states.indexOf('cancelled');
  // Stamp the steps we have real timestamps for: "Request sent" is when the
  // booking was created, and the cancelled step carries the cancellation time.
  const created = stepStamp(api.createdAt);
  const cancelled = stepStamp(api.cancelledAt);

  return STEP_IDS.map((id, index) => {
    const stamp =
      id === 'request-sent'
        ? created
        : states[index] === 'cancelled'
          ? cancelled
          : {};
    return {
      id,
      label: cancelledIndex === index ? 'Job canceled' : STEP_LABELS[index],
      state: states[index],
      ...stamp,
    };
  });
}

/** Split an ISO timestamp into the "09 Nov" / "4:10 PM" parts the timeline shows. */
function stepStamp(iso: string | null): { date?: string; time?: string } {
  if (!iso) {
    return {};
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return {};
  }
  return {
    date: `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]}`,
    time: formatDateTime(iso).split(' • ')[1],
  };
}

function stepStates(api: ApiBooking): TimelineState[] {
  switch (api.status) {
    case 'pending':
      return ['done', 'pending', 'inactive', 'inactive', 'inactive'];
    case 'accepted':
      return ['done', 'done', 'done', 'pending', 'inactive'];
    case 'ongoing':
      return api.awaitingConfirmation
        ? ['done', 'done', 'done', 'done', 'pending']
        : ['done', 'done', 'done', 'active', 'inactive'];
    case 'completed':
      return ['done', 'done', 'done', 'done', 'done'];
    case 'cancelled':
      return ['done', 'done', 'cancelled', 'inactive', 'inactive'];
    default:
      return ['inactive', 'inactive', 'inactive', 'inactive', 'inactive'];
  }
}

function toBooking(api: ApiBooking): Booking {
  const photo = toAbsoluteMediaUrl(api.artisan.photoUrl);
  const avatar: ImageSourcePropType = photo ? { uri: photo } : FALLBACK_AVATAR;

  return {
    id: String(api.id),
    status: api.status,
    artisanId: String(api.artisan.id),
    artisanName: api.artisan.name ?? 'Artisan',
    trade: api.trade,
    tradeFull: api.artisan.trade || api.trade,
    avatar,
    rating: (api.artisan.rating ?? 0).toFixed(1),
    reviewCount: String(api.artisan.reviewsCount ?? 0),
    distance: `${api.artisan.distanceKm} km away`,
    dateTime: formatDateTime(api.scheduledAt),
    scheduledAtIso: api.scheduledAt,
    location: api.location ?? '',
    address: api.address ?? '',
    latitude: api.latitude,
    longitude: api.longitude,
    service: api.service,
    languages: api.languages ?? '',
    jobDescription: api.jobDescription ?? '',
    budget: formatBudget(api.budget),
    messageToArtisan: api.messageToArtisan ?? '',
    timeline: api.timeline
      ? timelineFromApi(api.timeline)
      : timelineForStatus(api),
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
