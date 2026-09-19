import type { BookingStatus } from '../data/bookings';
import { appColors } from './clientApp';

/** Shared client-tab palette plus the tokens only the bookings flow needs. */
export const bookingColors = {
  ...appColors,
  /** "Raise a dispute" action. */
  gold: '#D5900B',
  notice: '#F5EDE2',
  noticeDanger: 'rgba(245, 233, 226, 0.4)',
} as const;

export const timelineColors = {
  done: '#0F6743',
  active: '#E8976D',
  pending: '#CBBBA1',
  cancelled: '#C44534',
  track: '#E1D9CC',
} as const;

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/**
 * Tinted badge tones used where a booking sits on top of a photo (dashboard
 * cards), rather than the solid fills used in the bookings list.
 */
export const STATUS_SOFT_COLORS: Record<
  BookingStatus,
  { background: string; text: string }
> = {
  pending: { background: '#FBF2D9', text: '#7A5A10' },
  accepted: { background: '#E4EDE7', text: '#0F6743' },
  ongoing: { background: '#FBE9D9', text: '#9A4E12' },
  completed: { background: '#E4EDE7', text: '#0F6743' },
  cancelled: { background: '#F7E2E0', text: '#A5301F' },
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#E8976D',
  accepted: '#118C57',
  ongoing: '#D77D36',
  completed: '#0F6743',
  cancelled: '#C44534',
};
