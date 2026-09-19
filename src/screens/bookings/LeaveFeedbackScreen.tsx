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
import { StarIcon } from '../../components/icons';
import { findBooking } from '../../data/bookings';
import { bookingColors } from '../../theme/bookings';
import type { AuthStackScreenProps } from '../../navigation/types';

const RATINGS = [1, 2, 3, 4, 5] as const;

const HIGHLIGHTS = [
  'Professional & courteous',
  'Punctual arrival',
  'Good communication',
  'Great work quality',
] as const;

export function LeaveFeedbackScreen({
  navigation,
  route,
}: AuthStackScreenProps<'LeaveFeedback'>) {
  const insets = useSafeAreaInsets();
  const booking = findBooking(route.params.bookingId);
  const [rating, setRating] = useState(0);
  const [highlights, setHighlights] = useState<readonly string[]>([]);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleHighlight = (tag: string) =>
    setHighlights(current =>
      current.includes(tag)
        ? current.filter(item => item !== tag)
        : [...current, tag],
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <BookingsHeader
        onBack={navigation.goBack}
        title="Leave a feedback"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Share your experience to help us keep improving Beta Work!
        </Text>

        <Text style={styles.prompt}>
          Rate your overall experience with{' '}
          <Text style={styles.promptName}>
            {booking?.artisanName ?? 'this artisan'}
          </Text>
        </Text>

        <View style={styles.ratingCard}>
          <View style={styles.starRow}>
            {RATINGS.map(value => (
              <Pressable
                key={value}
                accessibilityLabel={`Rate ${value} out of 5`}
                accessibilityRole="button"
                accessibilityState={{ selected: rating >= value }}
                hitSlop={6}
                onPress={() => setRating(value)}
              >
                <StarIcon
                  color={rating >= value ? bookingColors.star : bookingColors.textFaint}
                  filled={rating >= value}
                  size={30}
                />
              </Pressable>
            ))}
          </View>
          <Text style={styles.ratingHint}>1 = Poor, 5 = Excellent</Text>
        </View>

        <View style={styles.tagRow}>
          {HIGHLIGHTS.map(tag => {
            const isSelected = highlights.includes(tag);

            return (
              <Pressable
                key={tag}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => toggleHighlight(tag)}
                style={[styles.tag, isSelected && styles.tagSelected]}
              >
                <Text
                  style={[styles.tagLabel, isSelected && styles.tagLabelSelected]}
                >
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Write a review</Text>
          <TextInput
            multiline
            onChangeText={setReview}
            placeholder="Share your experience!"
            placeholderTextColor={bookingColors.placeholder}
            style={styles.textArea}
            textAlignVertical="top"
            value={review}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <BookingButton disabled={rating === 0} onPress={() => setSubmitted(true)}>
          Submit
        </BookingButton>
      </View>

      <SuccessModal
        message="Thank you for helping other clients hire with confidence."
        onClose={() => {
          setSubmitted(false);
          navigation.goBack();
        }}
        title="Review submitted successfully"
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
    gap: 20,
    padding: 24,
  },
  intro: {
    color: bookingColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  prompt: {
    color: bookingColors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  promptName: {
    fontWeight: '700',
  },
  ratingCard: {
    alignItems: 'center',
    backgroundColor: bookingColors.field,
    borderRadius: 4,
    gap: 10,
    paddingVertical: 20,
  },
  starRow: {
    flexDirection: 'row',
    gap: 20,
  },
  ratingHint: {
    color: bookingColors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: bookingColors.chipInactive,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tagSelected: {
    backgroundColor: bookingColors.primary,
  },
  tagLabel: {
    color: bookingColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  tagLabelSelected: {
    color: bookingColors.white,
    fontWeight: '500',
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
  footer: {
    backgroundColor: bookingColors.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
