import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BetaworkLogo from '../../assets/images/betawork-logo.svg';
import { colors } from '../theme/colors';

type SplashScreenProps = Readonly<{
  showLoader?: boolean;
}>;

export function SplashScreen({ showLoader = false }: SplashScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.brand}>
          <BetaworkLogo height={45} width={220} />
          <Text style={styles.tagline}>...Trustworthy connections</Text>
        </View>
        {showLoader ? (
          <ActivityIndicator
            color={colors.primary}
            size="small"
            style={styles.loader}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
    width: 263,
  },
  tagline: {
    color: '#5C3D27',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
});
