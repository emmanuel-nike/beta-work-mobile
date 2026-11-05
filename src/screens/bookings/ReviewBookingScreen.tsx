import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingArtisanCard } from '../../components/bookings/BookingArtisanCard';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentIcon,
  EditIcon,
  MapPinIcon,
  MessageChatIcon,
} from '../../components/icons';
import {
  bookingScheduledAtIso,
  formatBudgetAmount,
} from '../../data/bookingDraft';
import type { AuthStackScreenProps } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { editBooking, submitBooking } from '../../store/slices/bookingsSlice';
import { useBookingArtisan } from './useBookingArtisan';

const SURFACE = '#F7F1E6';
const TITLE = '#1F1611';
const LABEL = '#1F1611';
const VALUE = '#6B5744';
const MUTED = '#8B6B4D';
const ACCENT = '#0F6743';
const DIVIDER = '#E3D8C6';

export function ReviewBookingScreen({
  navigation,
  route,
}: AuthStackScreenProps<'ReviewBooking'>) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { artisanId, draft, bookingId } = route.params;
  const isEditing = Boolean(bookingId);
  const artisan = useBookingArtisan(artisanId);
  const [isSubmitting, setSubmitting] = useState(false);

  const editField = () => navigation.goBack();

  const sendRequest = async () => {
    if (isSubmitting) {
      return;
    }

    const details = {
      service: draft.serviceLabel ?? '',
      jobDescription: draft.jobDescription.trim(),
      scheduledAt: bookingScheduledAtIso(draft),
      location: draft.location.trim() || null,
      latitude: draft.latitude,
      longitude: draft.longitude,
      budget: draft.budget ? Number(draft.budget) : null,
      messageToArtisan: draft.message.trim() || null,
    };

    // Editing an existing booking: persist the change, then return to details.
    if (bookingId) {
      // Numeric ids are API-backed; demo bookings just navigate back.
      if (!/^\d+$/.test(bookingId)) {
        navigation.navigate('BookingDetails', { bookingId });
        return;
      }
      setSubmitting(true);
      const result = await dispatch(editBooking({ id: bookingId, input: details }));
      setSubmitting(false);

      if (editBooking.fulfilled.match(result)) {
        navigation.navigate('BookingDetails', { bookingId });
      } else {
        Alert.alert(
          'Changes not saved',
          result.payload ?? 'Something went wrong. Please try again.',
        );
      }
      return;
    }

    // Creating a new booking.
    // Numeric artisan ids are API-backed; demo catalogue artisans navigate only.
    if (!/^\d+$/.test(artisanId)) {
      navigation.navigate('BookingRequested', { artisanId, draft });
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      submitBooking({ artisanProfileId: Number(artisanId), ...details }),
    );
    setSubmitting(false);

    if (submitBooking.fulfilled.match(result)) {
      navigation.navigate('BookingRequested', { artisanId, draft });
    } else {
      Alert.alert(
        'Booking not sent',
        result.payload ?? 'Something went wrong. Please try again.',
      );
    }
  };

  const rows = [
    {
      key: 'service',
      icon: <BriefcaseIcon color={MUTED} size={18} />,
      label: 'Service',
      value: draft.serviceLabel ?? '—',
    },
    {
      key: 'description',
      icon: <DocumentIcon color={MUTED} size={18} />,
      label: 'Job description',
      value: draft.jobDescription || '—',
    },
    {
      key: 'datetime',
      icon: <CalendarIcon color={MUTED} size={18} />,
      label: 'Date & Time',
      value: draft.dateTimeLabel ?? '—',
    },
    {
      key: 'location',
      icon: <MapPinIcon color={MUTED} size={18} />,
      label: 'Service location',
      value: draft.location || '—',
    },
    {
      key: 'budget',
      icon: <Text style={styles.naira}>₦</Text>,
      label: 'Budget',
      value: formatBudgetAmount(draft.budget) || 'Not specified',
    },
    {
      key: 'message',
      icon: <MessageChatIcon color={MUTED} size={18} />,
      label: 'Message to artisan',
      value: draft.message || 'None',
    },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={navigation.goBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ArrowLeftIcon color={LABEL} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Review changes' : 'Review booking'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing
              ? 'Confirm your updated booking details'
              : 'Please confirm your booking details'}
          </Text>
        </View>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 150 },
        ]}
        showsVerticalScrollIndicator={false}>
        {artisan ? <BookingArtisanCard artisan={artisan} /> : null}

        <Text style={styles.sectionTitle}>Job details</Text>

        <View style={styles.rows}>
          {rows.map((row, index) => (
            <View key={row.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.row}>
                <View style={styles.iconBadge}>{row.icon}</View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Edit ${row.label}`}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={editField}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}>
                  <EditIcon color={ACCENT} size={14} />
                  <Text style={styles.editLabel}>Edit</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
          disabled={isSubmitting}
          onPress={sendRequest}
          style={({ pressed }) => [
            styles.cta,
            isSubmitting && styles.ctaDisabled,
            pressed && styles.pressed,
          ]}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaLabel}>
              {isEditing ? 'Save changes' : 'Send booking request'}
            </Text>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
          <Text style={styles.cancelLabel}>
            {isEditing ? 'Discard changes' : 'Cancel booking'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F2E9DB',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  back: {
    alignItems: 'center',
    backgroundColor: '#EDE4D5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    color: TITLE,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  headerSubtitle: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    color: TITLE,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 6,
    marginTop: 22,
  },
  rows: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: '#F2E8D7',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  naira: {
    color: MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
  rowBody: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  rowLabel: {
    color: LABEL,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  rowValue: {
    color: VALUE,
    fontSize: 13,
    lineHeight: 19,
  },
  editButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 24,
  },
  editLabel: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  divider: {
    backgroundColor: DIVIDER,
    height: StyleSheet.hairlineWidth,
  },
  footer: {
    backgroundColor: SURFACE,
    borderTopColor: DIVIDER,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  cancel: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 6,
  },
  cancelLabel: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
