import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { bookingColors } from '../../theme/bookings';
import { CloseIcon } from '../icons';
import { BookingButton } from './BookingButton';

type ConfirmModalProps = Readonly<{
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Disables the confirm button and swaps its label while the action runs. */
  busy?: boolean;
  busyLabel?: string;
  /** Shown above the actions when the confirmed action fails. */
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}>;

/** A two-action confirmation dialog used before irreversible booking actions. */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  busy = false,
  busyLabel,
  error,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            disabled={busy}
            hitSlop={8}
            onPress={onCancel}
            style={styles.close}
          >
            <CloseIcon />
          </Pressable>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <BookingButton
              disabled={busy}
              onPress={onConfirm}
              style={styles.action}
            >
              {busy ? (busyLabel ?? confirmLabel) : confirmLabel}
            </BookingButton>
            <BookingButton
              disabled={busy}
              onPress={onCancel}
              style={styles.action}
              variant="outlined"
            >
              {cancelLabel}
            </BookingButton>
          </View>
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
    backgroundColor: bookingColors.field,
    borderRadius: 20,
    gap: 8,
    paddingBottom: 24,
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
    zIndex: 1,
  },
  title: {
    color: bookingColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    paddingRight: 36,
  },
  message: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: bookingColors.danger,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  action: {
    height: 48,
  },
});
