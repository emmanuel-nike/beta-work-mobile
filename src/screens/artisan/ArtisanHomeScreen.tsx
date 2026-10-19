import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadArtisanProfile,
  refreshArtisanStatus,
  selectAuthToken,
  selectIsArtisanVerified,
} from '../../store/slices/authSlice';
import { ArtisanDashboardScreen } from '../ArtisanDashboardScreen';

export function ArtisanHomeScreen() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const isVerified = useAppSelector(selectIsArtisanVerified);

  // Pull the latest verification status so the dashboard flips to the approved
  // layout as soon as an admin approves the account (and never before), and the
  // saved portfolio so the profile-setup cards reflect real progress.
  useEffect(() => {
    if (token) {
      dispatch(refreshArtisanStatus());
      dispatch(loadArtisanProfile());
    }
  }, [dispatch, token]);

  return <ArtisanDashboardScreen isVerified={isVerified} />;
}
