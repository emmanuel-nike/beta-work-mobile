import { useEffect } from 'react';

import { ArtisanTabNavigator } from '../navigation/ArtisanTabNavigator';
import { ClientTabNavigator } from '../navigation/ClientTabNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  refreshCurrentUser,
  selectAppMode,
  selectAuthToken,
  selectIsArtisan,
} from '../store/slices/authSlice';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const isArtisan = useAppSelector(selectIsArtisan);
  const appMode = useAppSelector(selectAppMode);
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (!token) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(refreshCurrentUser());
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, token]);

  // An artisan is also a regular user, so they only see the artisan experience
  // while artisan mode is active; otherwise they use the app as a client.
  if (isArtisan && appMode === 'artisan') {
    return <ArtisanTabNavigator />;
  }

  return <ClientTabNavigator />;
}
