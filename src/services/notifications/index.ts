import { unregisterDevice } from '../../api/devices';
import { store } from '../../store';
import { connectRealtime, disconnectRealtime } from './realtime';
import { getCurrentPushToken, startPush, stopPush } from './push';

export { handleNotificationEvent } from './events';
export type { NotificationEvent, NotificationType } from './events';

/**
 * Start push + live SSE for the signed-in user. Reads the user id and token
 * from the auth store. Safe to call when already started (it reconnects the
 * stream); a no-op when there is no authenticated user.
 */
export async function startNotifications(): Promise<void> {
  const { auth } = store.getState();
  if (!auth.token || !auth.user) {
    return;
  }

  await startPush();
  await connectRealtime(auth.user.id, auth.token);
}

/**
 * Tear down the push listeners and SSE stream. Does not touch the backend; the
 * server-side token removal is done by {@link unregisterCurrentDevice} while the
 * auth token is still valid (i.e. before logout).
 */
export function teardownNotifications(): void {
  stopPush();
  disconnectRealtime();
}

/**
 * Remove this device's FCM token on the backend. Call this at the start of the
 * logout flow, before the auth token is invalidated, so the request is
 * authorized. Best-effort.
 */
export async function unregisterCurrentDevice(): Promise<void> {
  const token = getCurrentPushToken();
  if (!token) {
    return;
  }
  try {
    await unregisterDevice(token);
  } catch {
    // Best-effort: a failed unregister is pruned server-side on next send.
  }
}
