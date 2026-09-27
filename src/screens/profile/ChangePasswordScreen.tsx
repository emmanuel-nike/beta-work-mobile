import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PasswordIcon from '../../../assets/images/password.svg';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { ProfileFormField } from '../../components/profile/ProfileFormField';
import { SuccessModal } from '../../components/bookings/SuccessModal';
import { changePassword } from '../../api/auth';
import { ApiError } from '../../api/client';
import { appColors } from '../../theme/clientApp';
import type { AuthStackScreenProps } from '../../navigation/types';

const MIN_PASSWORD_LENGTH = 8;

export function ChangePasswordScreen({
  navigation,
}: AuthStackScreenProps<'ChangePassword'>) {
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (saving) {
      return;
    }
    setError(null);

    if (currentPassword.length === 0) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setDone(true);
    } catch (rejected) {
      setError(
        rejected instanceof ApiError
          ? rejected.message
          : 'Could not update your password. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <BookingsHeader
        onBack={navigation.goBack}
        title="Change password"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileFormField
          icon={PasswordIcon}
          isPassword
          label="Current password"
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
          value={currentPassword}
        />
        <ProfileFormField
          icon={PasswordIcon}
          isPassword
          label="New password"
          onChangeText={setNewPassword}
          placeholder="Type here"
          value={newPassword}
        />
        <ProfileFormField
          icon={PasswordIcon}
          isPassword
          label="Confirm new password"
          onChangeText={setConfirmPassword}
          placeholder="Re-enter new password"
          value={confirmPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            (pressed || saving) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonLabel}>
            {saving ? 'Updating…' : 'Update password'}
          </Text>
        </Pressable>
      </View>

      <SuccessModal
        message="Your password has been changed successfully."
        onClose={() => {
          setDone(false);
          navigation.goBack();
        }}
        title="Password updated"
        visible={done}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: appColors.surface,
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 24,
  },
  error: {
    color: appColors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: appColors.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 6,
    height: 56,
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: appColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
});
