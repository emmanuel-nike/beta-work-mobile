import { useEffect } from 'react';

import { ModeSwitchedSheet } from '../components/profile/ModeSwitchedSheet';
import { ArtisanTabNavigator } from '../navigation/ArtisanTabNavigator';
import { ClientTabNavigator } from '../navigation/ClientTabNavigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  applyPendingAppMode,
  loadArtisanProfile,
  refreshCurrentUser,
  selectAppMode,
  selectAppModeEpoch,
  selectAuthToken,
  selectIsArtisan,
  selectPendingAppMode,
} from '../store/slices/authSlice';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const isArtisan = useAppSelector(selectIsArtisan);
  const appMode = useAppSelector(selectAppMode);
  const pendingAppMode = useAppSelector(selectPendingAppMode);
  const appModeEpoch = useAppSelector(selectAppModeEpoch);
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

  useEffect(() => {
    if (!pendingAppMode) {
      return;
    }

    const timer = setTimeout(() => {
      const nextMode = pendingAppMode;
      dispatch(applyPendingAppMode());
      dispatch(refreshCurrentUser());
      if (nextMode === 'artisan') {
        dispatch(loadArtisanProfile());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, pendingAppMode]);

  // An artisan is also a regular user, so they only see the artisan experience
  // while artisan mode is active; otherwise they use the app as a client.
  const tabs =
    isArtisan && appMode === 'artisan' ? (
      <ArtisanTabNavigator key={`artisan-${appModeEpoch}`} />
    ) : (
      <ClientTabNavigator key={`client-${appModeEpoch}`} />
    );

  return (
    <>
      {tabs}
      <ModeSwitchedSheet mode={pendingAppMode} visible={pendingAppMode !== null} />
    </>
  );
}
