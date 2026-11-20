import { Transmit, Subscription } from '@adonisjs/transmit-client';
import RNEventSource from 'react-native-sse';

import { API_ORIGIN } from '../../config/env';
import { handleNotificationEvent, NotificationEvent } from './events';

let transmit: Transmit | null = null;
let subscription: Subscription | null = null;

/**
 * Open the SSE stream and subscribe to the signed-in user's channel for live
 * in-app updates. The bearer token authenticates both the event stream
 * (via the EventSource headers) and the subscribe/unsubscribe requests (via the
 * before-hooks). Best-effort: failures are logged and never thrown.
 */
export async function connectRealtime(
  userId: number,
  token: string,
): Promise<void> {
  disconnectRealtime();

  try {
    transmit = new Transmit({
      baseUrl: API_ORIGIN,
      // react-native-sse supports request headers, unlike the DOM EventSource.
      eventSourceFactory: url =>
        new RNEventSource(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        }) as unknown as EventSource,
      // React Native has no global EventTarget; status events are not needed.
      eventTargetFactory: () => null,
      beforeSubscribe: (request: Request) => {
        request.headers.set('Authorization', `Bearer ${token}`);
      },
      beforeUnsubscribe: (request: Request) => {
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    });

    const sub = transmit.subscription(`users/${userId}`);
    await sub.create();
    sub.onMessage((data: NotificationEvent) => handleNotificationEvent(data));
    subscription = sub;
  } catch (error) {
    console.warn('[notifications] realtime connect failed', error);
    disconnectRealtime();
  }
}

/** Tear down the subscription and close the SSE connection. */
export function disconnectRealtime(): void {
  try {
    subscription?.delete();
  } catch {
    // ignore
  }
  try {
    transmit?.close();
  } catch {
    // ignore
  }
  subscription = null;
  transmit = null;
}
