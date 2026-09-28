import { useEffect } from 'react';

import { ArtisanTabNavigator } from '../navigation/ArtisanTabNavigator';
import { ClientTabNavigator } from '../navigation/ClientTabNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  refreshCurrentUser,
  selectAuthToken,
  selectAuthUser,
} from '../store/slices/authSlice';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectAuthToken);
  const isArtisan = user?.role === 'artisan';

  useEffect(() => {
    if (!token) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(refreshCurrentUser());
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, token]);

  if (isArtisan) {
    return <ArtisanTabNavigator />;
  }

  return <ClientTabNavigator />;
}
