import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { DEFAULT_ONBOARDING_SCREEN_DURATION_MS } from '../theme/onboarding';

type ProgressBarProps = Readonly<{
  step: number;
  total?: number;
  durationMs?: number;
  onStepComplete?: () => void;
}>;

export function ProgressBar({
  step,
  total = 3,
  durationMs = DEFAULT_ONBOARDING_SCREEN_DURATION_MS,
  onStepComplete,
}: ProgressBarProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const onCompleteRef = useRef(onStepComplete);
  onCompleteRef.current = onStepComplete;

  useEffect(() => {
    progress.setValue(0);

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onCompleteRef.current?.();
      }
    });

    return () => animation.stop();
  }, [durationMs, progress, step]);

  const segments = Array.from({ length: total }, (_, index) => index + 1);
  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      accessibilityLabel={`Onboarding step ${step} of ${total}`}
      style={styles.container}>
      {segments.map(segment => {
        const isComplete = segment < step;
        const isCurrent = segment === step;

        return (
          <View key={`segment-${segment}`} style={styles.track}>
            {isComplete ? <View style={styles.fill} /> : null}
            {isCurrent ? (
              <Animated.View style={[styles.fill, { width: animatedWidth }]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    height: 9,
    width: '100%',
  },
  track: {
    backgroundColor: colors.progressTrack,
    borderRadius: 6,
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    height: '100%',
    width: '100%',
  },
});
