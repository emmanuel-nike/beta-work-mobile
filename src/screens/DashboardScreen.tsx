import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  refreshCurrentUser,
  selectAuthToken,
  selectAuthUser,
  selectIsArtisanVerified,
} from '../store/slices/authSlice';
import { ArtisanDashboardScreen } from './ArtisanDashboardScreen';
import { UserDashboardScreen } from './UserDashboardScreen';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectAuthToken);
  const isArtisanVerified = useAppSelector(selectIsArtisanVerified);
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
    return <ArtisanDashboardScreen isVerified={isArtisanVerified} />;
  }

  return <UserDashboardScreen />;
}
