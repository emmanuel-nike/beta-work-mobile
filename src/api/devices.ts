import { Platform } from 'react-native';

import { apiRequest } from './client';

/** The device platform reported to the backend for a registered FCM token. */
function currentPlatform(): 'ios' | 'android' | 'web' {
  return Platform.OS === 'ios' ? 'ios' : 'android';
}

/** Register (or refresh) this device's FCM token so it can receive push. */
export async function registerDevice(token: string): Promise<void> {
  await apiRequest('/devices', {
    method: 'POST',
    body: { token, platform: currentPlatform() },
  });
}

/** Unregister this device's FCM token (called on logout). */
export async function unregisterDevice(token: string): Promise<void> {
  await apiRequest(`/devices/${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
}
