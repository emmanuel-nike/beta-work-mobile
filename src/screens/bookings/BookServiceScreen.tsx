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

import { BookingArtisanCard } from '../../components/bookings/BookingArtisanCard';
import { DateTimeModal } from '../../components/bookings/DateTimeModal';
import { ServiceLocationModal } from '../../components/bookings/ServiceLocationModal';
import { ServicePickerModal } from '../../components/bookings/ServicePickerModal';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
  CurrentLocationIcon,
  MapPinIcon,
} from '../../components/icons';
import {
  createEmptyBookingDraft,
  formatBookingDateTime,
  type BookingDraft,
} from '../../data/bookingDraft';
import type { AuthStackScreenProps } from '../../navigation/types';
import { useBookingArtisan } from './useBookingArtisan';

const SURFACE = '#F7F1E6';
const TITLE = '#1F1611';
const LABEL = '#3D2E22';
const VALUE = '#1F1611';
const PLACEHOLDER = '#9E8A72';
const MUTED = '#8B6B4D';
const BORDER = '#A99F8E';
const ACCENT = '#0F6743';
const DESC_LIMIT = 500;

export function BookServiceScreen({
  navigation,
  route,
}: AuthStackScreenProps<'BookService'>) {
  const insets = useSafeAreaInsets();
  const artisan = useBookingArtisan(route.params.artisanId);
  const [draft, setDraft] = useState<BookingDraft>(createEmptyBookingDraft);
  const [isServiceOpen, setServiceOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);

  const update = (patch: Partial<BookingDraft>) =>
    setDraft(current => ({ ...current, ...patch }));

  const canReview =
    Boolean(draft.serviceId) &&
    draft.jobDescription.trim().length > 0 &&
    Boolean(draft.dateTimeLabel) &&
    draft.location.trim().length > 0;

  const onReview = () => {
    if (!canReview) {
      return;
    }
    navigation.navigate('ReviewBooking', {
      artisanId: route.params.artisanId,
      draft,
    });
  };

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
          <Text style={styles.headerTitle}>Book a service</Text>
          <Text style={styles.headerSubtitle}>
            Tell the artisan what you need help with
          </Text>
        </View>
        <View style={styles.back} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 120 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {artisan ? <BookingArtisanCard artisan={artisan} /> : null}

          <Text style={styles.sectionTitle}>Job details</Text>

          <Field label="Service">
            <Pressable
              accessibilityRole="button"
              onPress={() => setServiceOpen(true)}
              style={styles.select}>
              <Text
                style={draft.serviceLabel ? styles.selectValue : styles.placeholder}>
                {draft.serviceLabel ?? 'Select service'}
              </Text>
              <ChevronDownIcon color={LABEL} />
            </Pressable>
          </Field>

          <Field label="Job description">
            <View style={styles.textAreaWrap}>
              <TextInput
                maxLength={DESC_LIMIT}
                multiline
                onChangeText={value => update({ jobDescription: value })}
                placeholder="Describe the issue. e.g., Leaky pipe in the kitchen"
                placeholderTextColor={PLACEHOLDER}
                style={styles.textArea}
                value={draft.jobDescription}
              />
              <Text style={styles.counter}>
                {draft.jobDescription.length}/{DESC_LIMIT}
              </Text>
            </View>
          </Field>

          <Field
            hint="Availability will be confirmed by the artisan."
            label="Date">
            <Pressable
              accessibilityRole="button"
              onPress={() => setDateOpen(true)}
              style={styles.select}>
              <Text
                style={draft.dateTimeLabel ? styles.selectValue : styles.placeholder}>
                {draft.dateTimeLabel ?? 'Select date and time'}
              </Text>
              <CalendarIcon color={LABEL} size={20} />
            </Pressable>
          </Field>

          <Field label="Service location">
            <Pressable
              accessibilityRole="button"
              onPress={() => setLocationOpen(true)}
              style={styles.select}>
              <Text
                style={draft.location ? styles.selectValue : styles.placeholder}>
                {draft.location || 'Enter service location'}
              </Text>
              <MapPinIcon color={LABEL} size={20} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              hitSlop={6}
              onPress={() => update({ location: 'Current location, Abuja' })}
              style={({ pressed }) => [
                styles.currentLink,
                pressed && styles.pressed,
              ]}>
              <CurrentLocationIcon color={ACCENT} size={16} />
              <Text style={styles.currentLinkLabel}>Use your current location</Text>
            </Pressable>
          </Field>

          <Field
            hint="You can propose your budget or leave it blank if you'd like the artisan to quote."
            label="Budget"
            optional>
            <View style={styles.select}>
              <Text style={styles.naira}>₦</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={value =>
                  update({ budget: value.replace(/[^\d]/g, '') })
                }
                placeholder="Enter your budget"
                placeholderTextColor={PLACEHOLDER}
                style={styles.budgetInput}
                value={
                  draft.budget ? Number(draft.budget).toLocaleString('en-NG') : ''
                }
              />
            </View>
          </Field>

          <Field label="Message to artisan" optional>
            <View style={styles.textAreaWrap}>
              <TextInput
                maxLength={DESC_LIMIT}
                multiline
                onChangeText={value => update({ message: value })}
                placeholder="Add any extra instructions"
                placeholderTextColor={PLACEHOLDER}
                style={styles.textArea}
                value={draft.message}
              />
              <Text style={styles.counter}>
                {draft.message.length}/{DESC_LIMIT}
              </Text>
            </View>
          </Field>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          disabled={!canReview}
          onPress={onReview}
          style={({ pressed }) => [
            styles.cta,
            !canReview && styles.ctaDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.ctaLabel}>Review booking</Text>
        </Pressable>
      </View>

      <ServicePickerModal
        onClose={() => setServiceOpen(false)}
        onSelect={service => {
          update({ serviceId: service.id, serviceLabel: service.label });
          setServiceOpen(false);
        }}
        selectedId={draft.serviceId}
        visible={isServiceOpen}
      />

      <DateTimeModal
        initialDateIso={draft.dateIso}
        initialTime={draft.time}
        onClose={() => setDateOpen(false)}
        onConfirm={(date, time) => {
          update({
            dateIso: date.toISOString(),
            time,
            dateTimeLabel: formatBookingDateTime(date, time),
          });
          setDateOpen(false);
        }}
        visible={isDateOpen}
      />

      <ServiceLocationModal
        initialValue={draft.location}
        onClose={() => setLocationOpen(false)}
        onSelect={location => {
          update({ location });
          setLocationOpen(false);
        }}
        visible={isLocationOpen}
      />
    </View>
  );
}

function Field({
  label,
  optional,
  hint,
  children,
}: Readonly<{
  label: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {optional ? <Text style={styles.optional}> (Optional)</Text> : null}
      </Text>
      {children}
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: SURFACE,
    flex: 1,
  },
  flex: {
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
    marginBottom: 4,
    marginTop: 22,
  },
  field: {
    marginTop: 18,
  },
  fieldLabel: {
    color: LABEL,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  optional: {
    color: MUTED,
    fontWeight: '400',
  },
  fieldHint: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },
  select: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 8,
    borderWidth: 0.5,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  selectValue: {
    color: VALUE,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  placeholder: {
    color: PLACEHOLDER,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  textAreaWrap: {
    borderColor: BORDER,
    borderRadius: 8,
    borderWidth: 0.5,
    minHeight: 120,
    paddingBottom: 26,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  textArea: {
    color: VALUE,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 72,
    padding: 0,
    textAlignVertical: 'top',
  },
  counter: {
    bottom: 10,
    color: MUTED,
    fontSize: 12,
    position: 'absolute',
    right: 16,
  },
  naira: {
    color: PLACEHOLDER,
    fontSize: 15,
  },
  budgetInput: {
    color: VALUE,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  currentLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
  },
  currentLinkLabel: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: SURFACE,
    borderTopColor: '#E3D8C6',
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
    opacity: 0.5,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});
