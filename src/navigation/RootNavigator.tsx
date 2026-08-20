import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { SplashScreen } from '../screens/SplashScreen';
import { useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  selectIsBootstrapping,
} from '../store/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { PreAuthNavigator } from './PreAuthNavigator';

const MIN_SPLASH_DURATION_MS = 1500;

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isBootstrapping = useAppSelector(selectIsBootstrapping);
  const [hasMinDurationElapsed, setHasMinDurationElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setHasMinDurationElapsed(true),
      MIN_SPLASH_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  if (isBootstrapping || !hasMinDurationElapsed) {
    return <SplashScreen showLoader />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthNavigator /> : <PreAuthNavigator />}
    </NavigationContainer>
  );
}
