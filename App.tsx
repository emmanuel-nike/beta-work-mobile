import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from './src/components/ActionButton';
import { ArtisanFlow } from './src/screens/ArtisanFlow';
import { OnboardingFlow } from './src/screens/OnboardingFlow';
import { SignInFlow } from './src/screens/SignInFlow';
import { SignupFlow } from './src/screens/SignupFlow';
import { colors } from './src/theme/colors';

type AppScreen =
  | 'onboarding'
  | 'signup'
  | 'signin'
  | 'artisanSignup'
  | 'dashboard';

function App() {
  const [screen, setScreen] = useState<AppScreen>('onboarding');

  if (screen === 'signup') {
    return (
      <SignupFlow
        onDashboard={() => setScreen('dashboard')}
        onSignIn={() => setScreen('signin')}
      />
    );
  }

  if (screen === 'signin') {
    return (
      <SignInFlow
        onDashboard={() => setScreen('dashboard')}
        onSignUp={() => setScreen('signup')}
      />
    );
  }

  if (screen === 'artisanSignup') {
    return (
      <ArtisanFlow
        onDashboard={() => setScreen('dashboard')}
        onSignIn={() => setScreen('signin')}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.dashboard}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        <View style={styles.dashboardContent}>
          <Text style={styles.dashboardTitle}>Welcome to Beta Work!</Text>
          <Text style={styles.dashboardBody}>
            You’re signed in. Explore trusted artisans near you.
          </Text>
          <ActionButton onPress={() => setScreen('onboarding')}>
            Restart demo
          </ActionButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <OnboardingFlow
      onCreateAccount={() => setScreen('signup')}
      onLogin={() => setScreen('signin')}
      onOfferService={() => setScreen('artisanSignup')}
    />
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

export default App;
