import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppMode, AuthSession } from './slices/authSlice';

const AUTH_STORAGE_KEY = '@betawork/auth-session';
const APP_MODE_STORAGE_KEY = '@betawork/app-mode-by-user';

type AppModeByUserId = Record<string, AppMode>;

let appModeWriteQueue: Promise<void> = Promise.resolve();

export async function loadStoredSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed?.token || !parsed.user) {
      return null;
    }

    return {
      token: parsed.token,
      tokenType: parsed.tokenType ?? 'bearer',
      user: parsed.user,
    };
  } catch {
    return null;
  }
}

export async function persistSession(session: AuthSession): Promise<void> {
  try {
    if (!session.token) {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage failures are non-fatal for the session lifecycle.
  }
}

export async function clearStoredSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function readAppModes(): Promise<AppModeByUserId> {
  try {
    const raw = await AsyncStorage.getItem(APP_MODE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as AppModeByUserId;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

/** Last chosen experience for this account, if one has been saved on device. */
export async function loadStoredAppMode(userId: number): Promise<AppMode | null> {
  const modes = await readAppModes();
  const mode = modes[String(userId)];
  return mode === 'artisan' || mode === 'client' ? mode : null;
}

/** Remember the experience for this user id across restarts and later sign-ins. */
export function persistAppMode(userId: number, mode: AppMode): Promise<void> {
  const write = appModeWriteQueue.then(async () => {
    const modes = await readAppModes();
    modes[String(userId)] = mode;
    await AsyncStorage.setItem(APP_MODE_STORAGE_KEY, JSON.stringify(modes));
  });
  appModeWriteQueue = write.catch(() => undefined);
  return write.catch(() => undefined);
}
