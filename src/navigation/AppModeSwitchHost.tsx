import { CommonActions } from '@react-navigation/native';
import { useEffect } from 'react';

import { ModeSwitchedSheet } from '../components/profile/ModeSwitchedSheet';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  applyPendingAppMode,
  loadArtisanProfile,
  refreshCurrentUser,
  selectPendingAppMode,
} from '../store/slices/authSlice';
import { navigationRef } from './navigationRef';

/** Shows the mode-switched sheet, then reloads the app onto the home tab. */
export function AppModeSwitchHost() {
  const dispatch = useAppDispatch();
  const pendingAppMode = useAppSelector(selectPendingAppMode);

  useEffect(() => {
    if (!pendingAppMode) {
      return;
    }

    const nextMode = pendingAppMode;
    const timer = setTimeout(() => {
      dispatch(applyPendingAppMode());
      dispatch(refreshCurrentUser());
      if (nextMode === 'artisan') {
        dispatch(loadArtisanProfile());
      }

      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Dashboard',
                state: {
                  index: 0,
                  routes: [{ name: 'home' }],
                },
              },
            ],
          }),
        );
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, pendingAppMode]);

  return (
    <ModeSwitchedSheet mode={pendingAppMode} visible={pendingAppMode !== null} />
  );
}
