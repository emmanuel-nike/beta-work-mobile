import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession } from './slices/authSlice';

const AUTH_STORAGE_KEY = '@betawork/auth-session';

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
