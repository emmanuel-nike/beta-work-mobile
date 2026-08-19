import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  selectIsBootstrapping,
} from '../store/slices/authSlice';
import { colors } from '../theme/colors';
import { AuthNavigator } from './AuthNavigator';
import { PreAuthNavigator } from './PreAuthNavigator';

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isBootstrapping = useAppSelector(selectIsBootstrapping);

  if (isBootstrapping) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthNavigator /> : <PreAuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
