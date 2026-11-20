import { store } from '../../store';
import { loadMyBookings } from '../../store/slices/bookingsSlice';
import { loadMyJobs } from '../../store/slices/artisanJobsSlice';

/**
 * Event types mirrored from the backend NotificationService. They arrive as the
 * `type` field of an FCM data message and of an SSE message, and tell the app
 * which slice of its state to refetch so updates reflect near-instantly.
 */
export type NotificationType =
  | 'booking.requested'
  | 'booking.accepted'
  | 'booking.declined'
  | 'booking.completed';

export interface NotificationEvent {
  type: NotificationType | string;
  bookingId?: string | number;
  status?: string;
}

/**
 * Refresh the data affected by a notification event. Every booking event can
 * change the client's bookings list and (for artisans) the jobs list, so we
 * refetch what applies to the signed-in user. The thunks are no-ops server-side
 * when unauthorized, and we guard on the auth token to avoid stray calls.
 */
export function handleNotificationEvent(
  event: NotificationEvent | null | undefined,
): void {
  if (
    !event ||
    typeof event.type !== 'string' ||
    !event.type.startsWith('booking.')
  ) {
    return;
  }

  const { auth } = store.getState();
  if (!auth.token) {
    return;
  }

  store.dispatch(loadMyBookings());
  if (auth.user?.role === 'artisan') {
    store.dispatch(loadMyJobs());
  }
}
