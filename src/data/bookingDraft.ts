import { ARTISAN_SERVICES } from './artisanServices';

/**
 * The booking the client is composing across the Book a service → Review →
 * Request-sent flow. Kept serialisable so it can travel through navigation
 * params between the screens.
 */
export type BookingDraft = {
  serviceId: string | null;
  serviceLabel: string | null;
  jobDescription: string;
  /** Display label, e.g. "12 Sept 2026 • 10:00 AM". */
  dateTimeLabel: string | null;
  /** ISO form of the chosen date (time is carried in the label). */
  dateIso: string | null;
  time: string | null;
  location: string;
  /** Digits only, "" when left blank. */
  budget: string;
  message: string;
};

export function createEmptyBookingDraft(): BookingDraft {
  return {
    serviceId: null,
    serviceLabel: null,
    jobDescription: '',
    dateTimeLabel: null,
    dateIso: null,
    time: null,
    location: '',
    budget: '',
    message: '',
  };
}

/** Services offered, used by the Service dropdown. */
export const SERVICE_OPTIONS = ARTISAN_SERVICES.map(service => ({
  id: service.id,
  label: service.label,
}));

/** Preset slots shown under "Available times". */
export const BOOKING_TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
] as const;

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** "12 Sept 2026 • 10:00 AM" from a date and a time label. */
export function formatBookingDateTime(date: Date, time: string): string {
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} ${month} ${date.getFullYear()} • ${time}`;
}

/** Format a time from 24h parts into "10:45 AM". */
export function formatTime12h(hours24: number, minutes: number): string {
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

/**
 * Combine the draft's chosen date (`dateIso`, stored at midnight) with its time
 * label ("10:00 AM") into an ISO timestamp for the API. Returns null when no
 * date has been chosen.
 */
export function bookingScheduledAtIso(draft: BookingDraft): string | null {
  if (!draft.dateIso) {
    return null;
  }
  const date = new Date(draft.dateIso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const time = parseTimeLabel(draft.time);
  if (time) {
    date.setHours(time.hours, time.minutes, 0, 0);
  }
  return date.toISOString();
}

/** Parse a "10:00 AM" / "1:30 PM" label into 24h parts, or null if malformed. */
function parseTimeLabel(
  time: string | null,
): { hours: number; minutes: number } | null {
  if (!time) {
    return null;
  }
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) {
    return null;
  }
  let hours = Number(match[1]) % 12;
  if (/pm/i.test(match[3])) {
    hours += 12;
  }
  return { hours, minutes: Number(match[2]) };
}

/** "₦100,000" from a digit string; "" when empty. */
export function formatBudgetAmount(digits: string): string {
  const clean = digits.replace(/[^\d]/g, '');
  if (!clean) {
    return '';
  }
  return `₦${Number(clean).toLocaleString('en-NG')}`;
}
