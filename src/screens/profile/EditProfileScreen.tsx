import { useMemo, useState } from 'react';
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

import AddressIcon from '../../../assets/images/address.svg';
import EmailIcon from '../../../assets/images/email.svg';
import PhoneIcon from '../../../assets/images/phone.svg';
import UserIcon from '../../../assets/images/user.svg';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { ProfileFormField } from '../../components/profile/ProfileFormField';
import { appColors } from '../../theme/clientApp';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectAuthUser,
  updateUserProfile,
} from '../../store/slices/authSlice';
import type { AuthStackScreenProps } from '../../navigation/types';

export function EditProfileScreen({
  navigation,
}: AuthStackScreenProps<'EditProfile'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  const initial = useMemo(
    () => ({
      fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim(),
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      address: user?.address ?? '',
    }),
    [user],
  );

  const [fullName, setFullName] = useState(initial.fullName);
  const [email, setEmail] = useState(initial.email);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [address, setAddress] = useState(initial.address);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (saving) {
      return;
    }
    setError(null);

    const trimmedName = fullName.trim();
    if (trimmedName.length === 0) {
      setError('Please enter your full name.');
      return;
    }

    const [firstName, ...rest] = trimmedName.split(/\s+/);
    const lastName = rest.join(' ');

    setSaving(true);
    try {
      await dispatch(
        updateUserProfile({
          firstName,
          lastName,
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
        }),
      ).unwrap();
      navigation.goBack();
    } catch (rejected) {
      setError(
        typeof rejected === 'string'
          ? rejected
          : 'Could not update your profile. Please try again.',
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
        title="Profile details"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileFormField
          autoCapitalize="words"
          icon={UserIcon}
          label="Full name"
          onChangeText={setFullName}
          placeholder="Your full name"
          textContentType="name"
          value={fullName}
        />
        <ProfileFormField
          autoCapitalize="none"
          icon={EmailIcon}
          keyboardType="email-address"
          label="Email address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />
        <ProfileFormField
          icon={PhoneIcon}
          keyboardType="phone-pad"
          label="Phone number"
          onChangeText={setPhoneNumber}
          placeholder="080..."
          textContentType="telephoneNumber"
          value={phoneNumber}
        />
        <ProfileFormField
          icon={AddressIcon}
          label="Address"
          onChangeText={setAddress}
          placeholder="Your address"
          value={address}
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
            {saving ? 'Updating…' : 'Update profile'}
          </Text>
        </Pressable>
      </View>
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
