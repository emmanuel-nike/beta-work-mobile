import { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logoutUser,
  refreshCurrentUser,
  selectAuthToken,
  selectAuthUser,
  signOut,
} from '../store/slices/authSlice';
import { colors } from '../theme/colors';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectAuthToken);
  const displayName = user?.firstName?.trim() || 'there';

  useEffect(() => {
    if (!token) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(refreshCurrentUser());
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, token]);

  const handleSignOut = () => {
    if (token) {
      dispatch(logoutUser());
      return;
    }
    dispatch(signOut());
  };

  return (
    <SafeAreaView style={styles.dashboard}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={styles.dashboardContent}>
        <Text style={styles.dashboardTitle}>Welcome to Beta Work!</Text>
        <Text style={styles.dashboardBody}>
          You’re signed in{user ? `, ${displayName}` : ''}. Explore trusted
          artisans near you.
        </Text>
        <ActionButton onPress={handleSignOut}>Sign out</ActionButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: colors.background,
    flex: 1,
  },
  dashboardContent: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dashboardTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  dashboardBody: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});
