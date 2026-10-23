import { Modal, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppMode } from '../../store/slices/authSlice';
import { appColors } from '../../theme/clientApp';
import { SuccessCheckIcon } from '../icons';

type ModeSwitchedSheetProps = Readonly<{
  visible: boolean;
  mode: AppMode | null;
}>;

/** Success sheet shown after switching between artisan and client mode. */
export function ModeSwitchedSheet({ visible, mode }: ModeSwitchedSheetProps) {
  const insets = useSafeAreaInsets();
  const modeLabel = mode === 'artisan' ? 'Artisan Mode' : 'Client Mode';

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => undefined}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.root}>
        <View style={styles.backdrop} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <SuccessCheckIcon size={72} />
          <Text style={styles.title}>Mode switched</Text>
          <Text style={styles.body}>
            You are now in {modeLabel}. Taking you to the home page…
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 16, 8, 0.28)',
  },
  sheet: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    color: appColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  body: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 48,
  },
});
