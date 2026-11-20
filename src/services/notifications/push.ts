import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { registerDevice } from '../../api/devices';
import { handleNotificationEvent, NotificationEvent } from './events';

let currentToken: string | null = null;
let listeners: Array<() => void> = [];

/** The FCM token for this device, if one has been obtained. */
export function getCurrentPushToken(): string | null {
  return currentToken;
}

async function hasPermission(): Promise<boolean> {
  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Request permission, obtain the FCM token, register it with the backend, and
 * wire the foreground + tap handlers so a received message refreshes the app's
 * data. Entirely best-effort: any failure (permission denied, native module
 * missing in a dev build) is logged and swallowed so the app keeps working.
 */
export async function startPush(): Promise<void> {
  try {
    if (!(await hasPermission())) {
      return;
    }

    // iOS must register with APNs before a token can be issued.
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    currentToken = await messaging().getToken();
    await safeRegister(currentToken);

    listeners.push(
      messaging().onTokenRefresh(async (next: string) => {
        currentToken = next;
        await safeRegister(next);
      }),
    );

    // Foreground messages: refresh immediately.
    listeners.push(
      messaging().onMessage(async message => dispatchFromMessage(message)),
    );

    // Notification tapped while the app was backgrounded.
    listeners.push(
      messaging().onNotificationOpenedApp(message =>
        dispatchFromMessage(message),
      ),
    );

    // Notification tapped to launch the app from a cold start.
    const initial = await messaging().getInitialNotification();
    if (initial) {
      dispatchFromMessage(initial);
    }
  } catch (error) {
    console.warn('[notifications] push setup failed', error);
  }
}

/** Remove the FCM listeners (does not unregister the token server-side). */
export function stopPush(): void {
  listeners.forEach(remove => {
    try {
      remove();
    } catch {
      // ignore
    }
  });
  listeners = [];
}

async function safeRegister(token: string | null): Promise<void> {
  if (!token) {
    return;
  }
  try {
    await registerDevice(token);
  } catch (error) {
    console.warn('[notifications] device registration failed', error);
  }
}

function dispatchFromMessage(
  message: FirebaseMessagingTypes.RemoteMessage | null,
): void {
  const data = message?.data;
  if (data && typeof data.type === 'string') {
    handleNotificationEvent(data as unknown as NotificationEvent);
  }
}
