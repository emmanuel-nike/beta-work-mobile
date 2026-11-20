import { useEffect } from 'react';

import { useAppSelector } from '../store/hooks';
import {
  startNotifications,
  teardownNotifications,
} from '../services/notifications';

/**
 * Starts push + live SSE once the user is authenticated and tears the listeners
 * down when they sign out. The server-side device unregistration happens inside
 * the logout flow (while the token is still valid), so this only manages the
 * client-side listeners/stream.
 */
export function useNotifications(): void {
  const userId = useAppSelector(state => state.auth.user?.id ?? null);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    startNotifications().catch(() => {
      // best-effort; startNotifications already logs internally
    });
    return () => {
      teardownNotifications();
    };
  }, [isAuthenticated, userId]);
}
