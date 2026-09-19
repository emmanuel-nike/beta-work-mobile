import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { bookingColors } from '../../theme/bookings';
import { CloseIcon, SuccessCheckIcon } from '../icons';

type SuccessModalProps = Readonly<{
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}>;

export function SuccessModal({
  visible,
  title,
  message,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onClose}
            style={styles.close}
          >
            <CloseIcon />
          </Pressable>

          <SuccessCheckIcon />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(24, 16, 8, 0.45)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: bookingColors.field,
    borderRadius: 20,
    gap: 8,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    width: '100%',
  },
  close: {
    alignItems: 'center',
    backgroundColor: 'rgba(166, 147, 118, 0.24)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
  },
  title: {
    color: bookingColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
