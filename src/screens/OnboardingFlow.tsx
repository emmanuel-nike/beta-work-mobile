import { useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  Image,
  PanResponder,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { SvgProps } from 'react-native-svg';

import BookTermsArtwork from '../../assets/images/book-terms.svg';
import FeedbackArtwork from '../../assets/images/feedback.svg';
import HireArtisansArtwork from '../../assets/images/hire-artisans.svg';
import BetaworkLogo from '../../assets/images/betawork-logo.svg';
import RoleSelectionArtwork from '../../assets/images/role-selection.svg';
import WelcomeArtwork from '../../assets/images/welcome.png';
import { ActionButton } from '../components/ActionButton';
import { ProgressBar } from '../components/ProgressBar';
import { colors } from '../theme/colors';
import { DEFAULT_ONBOARDING_SCREEN_DURATION_MS } from '../theme/onboarding';

type Screen = 'splash' | 'welcome' | 'role' | 'onboarding';

type OnboardingPage = {
  artwork: ComponentType<SvgProps>;
  title: string;
  description: string;
};

const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    artwork: HireArtisansArtwork,
    title: 'Hire verified Artisans with confidence',
    description:
      'Stop worrying about reliability. Connect with skilled, trustworthy professionals for your project.',
  },
  {
    artwork: BookTermsArtwork,
    title: 'Book on your terms',
    description:
      'Pick the time that works for you and confirm details in-app with instant chat.',
  },
  {
    artwork: FeedbackArtwork,
    title: 'Your feedback matters',
    description:
      'Rate artisans after each job to enhance reliability and build a stronger community.',
  },
];

export function OnboardingFlow({
  onCreateAccount,
  onOfferService,
  onLogin,
  screenDurationMs = DEFAULT_ONBOARDING_SCREEN_DURATION_MS,
}: Readonly<{
  onCreateAccount: () => void;
  onOfferService: () => void;
  onLogin: () => void;
  screenDurationMs?: number;
}>) {
  const [screen, setScreen] = useState<Screen>('splash');
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (screen !== 'splash') {
      return;
    }

    const timer = setTimeout(() => setScreen('welcome'), 1800);
    return () => clearTimeout(timer);
  }, [screen]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          screen === 'onboarding' && Math.abs(gesture.dx) > 12,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -45 && pageIndex < ONBOARDING_PAGES.length - 1) {
            setPageIndex(current => current + 1);
          }
          if (gesture.dx > 45 && pageIndex > 0) {
            setPageIndex(current => current - 1);
          }
        },
      }),
    [pageIndex, screen],
  );

  const openOnboarding = (initialPage: number) => {
    setPageIndex(initialPage);
    setScreen('onboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea} {...panResponder.panHandlers}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      {screen === 'splash' ? <SplashScreen /> : null}
      {screen === 'welcome' ? (
        <WelcomeScreen
          onGetStarted={() => setScreen('role')}
          onLogin={onLogin}
        />
      ) : null}
      {screen === 'role' ? (
        <RoleSelectionScreen
          onNeedService={() => openOnboarding(0)}
          onOfferService={onOfferService}
        />
      ) : null}
      {screen === 'onboarding' ? (
        <OnboardingScreen
          onCreateAccount={onCreateAccount}
          onPageChange={setPageIndex}
          pageIndex={pageIndex}
          screenDurationMs={screenDurationMs}
        />
      ) : null}
    </SafeAreaView>
  );
}

function SplashScreen() {
  return (
    <View style={[styles.screen, styles.splash]}>
      <View style={styles.splashBrand}>
        <BetaworkLogo height={45} width={220} />
        <Text style={styles.splashTagline}>...Trustworthy connections</Text>
      </View>
    </View>
  );
}

function WelcomeScreen({
  onGetStarted,
  onLogin,
}: Readonly<{ onGetStarted: () => void; onLogin: () => void }>) {
  return (
    <View style={styles.screen}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={WelcomeArtwork}
        style={styles.welcomeArtwork}
      />
      <View style={styles.welcomeContent}>
        <Text style={styles.title}>
          Work made simple, connections made easy.
        </Text>
        <Text style={styles.description}>
          Join Beta Work! to discover services and share your skills.
        </Text>
      </View>
      <View style={styles.welcomeActions}>
        <ActionButton onPress={onGetStarted}>Get started</ActionButton>
        <ActionButton onPress={onLogin} variant="outlined">
          Login
        </ActionButton>
      </View>
    </View>
  );
}

type RoleSelectionScreenProps = Readonly<{
  onNeedService: () => void;
  onOfferService: () => void;
}>;

function RoleSelectionScreen({
  onNeedService,
  onOfferService,
}: RoleSelectionScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.roleArtwork}>
        <RoleSelectionArtwork height="100%" width="100%" />
      </View>
      <Text style={[styles.title, styles.roleTitle]}>
        How would you like to get started?
      </Text>
      <View style={styles.roleActions}>
        <ActionButton large onPress={onOfferService}>
          I offer a service
        </ActionButton>
        <ActionButton onPress={onNeedService} variant="outlined">
          I need a service
        </ActionButton>
      </View>
    </View>
  );
}

function OnboardingScreen({
  pageIndex,
  onCreateAccount,
  onPageChange,
  screenDurationMs,
}: Readonly<{
  pageIndex: number;
  onCreateAccount: () => void;
  onPageChange: (pageIndex: number) => void;
  screenDurationMs: number;
}>) {
  const page = ONBOARDING_PAGES[pageIndex];
  const Artwork = page.artwork;

  return (
    <View style={[styles.screen, styles.onboardingScreen]}>
      <ProgressBar
        durationMs={screenDurationMs}
        onStepComplete={() => {
          if (pageIndex < ONBOARDING_PAGES.length - 1) {
            onPageChange(pageIndex + 1);
          }
        }}
        step={pageIndex + 1}
        total={ONBOARDING_PAGES.length}
      />
      <View style={styles.onboardingArtwork}>
        <Artwork height="100%" width="100%" />
      </View>
      <View style={styles.onboardingContent}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.description}>{page.description}</Text>
      </View>
      <ActionButton
        onPress={onCreateAccount}
        style={styles.createAccountButton}>
        Create account
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
  },
  splash: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBrand: {
    alignItems: 'center',
    gap: 8,
    width: 263,
  },
  splashTagline: {
    color: '#5C3D27',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  welcomeArtwork: {
    alignSelf: 'center',
    height: 409,
    marginTop: 39,
    width: 409,
  },
  welcomeContent: {
    alignItems: 'center',
    gap: 12,
    marginTop: -49,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 31.2,
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    textAlign: 'center',
  },
  welcomeActions: {
    gap: 16,
    marginTop: 56,
  },
  roleArtwork: {
    alignSelf: 'center',
    height: 462,
    marginTop: 64,
    width: 462,
  },
  roleTitle: {
    marginTop: -128,
  },
  roleActions: {
    gap: 16,
    marginTop: 36,
  },
  onboardingScreen: {
    paddingTop: 24,
  },
  onboardingArtwork: {
    aspectRatio: 1,
    marginTop: 46,
    width: '100%',
  },
  onboardingContent: {
    gap: 8,
    marginTop: 32,
  },
  createAccountButton: {
    marginTop: 56,
  },
});
