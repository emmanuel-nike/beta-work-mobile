import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingButton } from '../../components/bookings/BookingButton';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { SuccessModal } from '../../components/bookings/SuccessModal';
import { PlusIcon } from '../../components/icons';
import { bookingColors } from '../../theme/bookings';
import type { AuthStackScreenProps } from '../../navigation/types';

const MIN_DETAIL_LENGTH = 20;
const PHOTO_SLOTS = [0, 1, 2];

const DISPUTE_REASONS = [
  'Artisan did not show up as scheduled.',
  'Artisan left the job unfinished.',
  'Artisan requested extra payment',
  'Unprofessional behaviour.',
  'Work quality is poor/unacceptable.',
  'Other (Please explain below).',
] as const;

export function RaiseDisputeScreen({
  navigation,
}: AuthStackScreenProps<'RaiseDispute'>) {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = reason !== null && details.trim().length >= MIN_DETAIL_LENGTH;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <BookingsHeader
        onBack={navigation.goBack}
        title="Raise a dispute"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introEmphasis}>
            We're sorry something didn't go as expected.
          </Text>
          <Text style={styles.introBody}>
            Please tell us what happened so we can help. Our admin team will
            review your report within 24 hours
          </Text>
        </View>

        <Text style={styles.question}>What type of service do you need?</Text>

        <View style={styles.optionCard}>
          {DISPUTE_REASONS.map((option, index) => {
            const isSelected = reason === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => setReason(option)}
                style={[
                  styles.option,
                  index === DISPUTE_REASONS.length - 1 && styles.optionLast,
                ]}
              >
                <Text style={styles.optionLabel}>{option}</Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tell us more</Text>
          <TextInput
            multiline
            onChangeText={setDetails}
            placeholder={`Please describe what happened (minimum ${MIN_DETAIL_LENGTH} characters).`}
            placeholderTextColor={bookingColors.placeholder}
            style={styles.textArea}
            textAlignVertical="top"
            value={details}
          />
          <Text style={styles.helper}>
            Details help us resolve your case faster.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Add photos (optional)</Text>
          <View style={styles.photoRow}>
            {PHOTO_SLOTS.map(slot => (
              <Pressable
                key={slot}
                accessibilityLabel="Add photo"
                accessibilityRole="button"
                style={styles.photoSlot}
              >
                <View style={styles.photoIcon}>
                  <PlusIcon />
                </View>
                <Text style={styles.photoLabel}>Add photo</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <BookingButton disabled={!canSubmit} onPress={() => setSubmitted(true)}>
          Submit dispute
        </BookingButton>
      </View>

      <SuccessModal
        message="Our team will review and get back to you shortly."
        onClose={() => {
          setSubmitted(false);
          navigation.goBack();
        }}
        title="Dispute submitted successfully"
        visible={submitted}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: bookingColors.surface,
    flex: 1,
  },
  content: {
    gap: 24,
    padding: 24,
  },
  intro: {
    gap: 8,
  },
  introEmphasis: {
    color: bookingColors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  introBody: {
    color: bookingColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  question: {
    color: bookingColors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: -12,
  },
  optionCard: {
    backgroundColor: bookingColors.field,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    height: 40,
    justifyContent: 'space-between',
  },
  optionLast: {
    marginBottom: 4,
  },
  optionLabel: {
    color: bookingColors.textPrimary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  radio: {
    alignItems: 'center',
    borderColor: bookingColors.cardBorder,
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioSelected: {
    borderColor: bookingColors.primary,
  },
  radioDot: {
    backgroundColor: bookingColors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    color: bookingColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: bookingColors.field,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    color: bookingColors.textPrimary,
    fontSize: 13,
    height: 139,
    lineHeight: 18,
    padding: 16,
  },
  helper: {
    color: bookingColors.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoSlot: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: bookingColors.field,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  photoIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(216, 199, 173, 0.4)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  photoLabel: {
    color: bookingColors.primary,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },
  footer: {
    backgroundColor: bookingColors.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
