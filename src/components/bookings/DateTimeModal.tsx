import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOOKING_TIME_SLOTS,
  MONTHS_LONG,
  WEEKDAY_LABELS,
  formatTime12h,
} from '../../data/bookingDraft';
import {
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  InfoIcon,
} from '../icons';

const SURFACE = '#FBF6EC';
const TITLE = '#1F1611';
const BODY = '#3D2E22';
const MUTED = '#8B7A66';
const FAINT = '#C3B49C';
const ACCENT = '#0F6743';
const BORDER = '#DDD0BC';

type Tab = 'available' | 'custom';

type DateTimeModalProps = Readonly<{
  visible: boolean;
  initialDateIso?: string | null;
  initialTime?: string | null;
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}>;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Month cells, Monday-first, with leading blanks for alignment. */
function buildMonthGrid(year: number, month: number): Array<number | null> {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  return cells;
}

export function DateTimeModal({
  visible,
  initialDateIso,
  initialTime,
  onClose,
  onConfirm,
}: DateTimeModalProps) {
  const insets = useSafeAreaInsets();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>('available');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // Seed from the current draft each time the sheet opens.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const seedDate = initialDateIso ? startOfDay(new Date(initialDateIso)) : null;
    setSelectedDate(seedDate);
    setViewYear((seedDate ?? today).getFullYear());
    setViewMonth((seedDate ?? today).getMonth());
    setSelectedTime(initialTime ?? null);
    setTab('available');
    setCustomValue(null);
    setShowPicker(false);
  }, [visible, initialDateIso, initialTime, today]);

  const cells = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goPrev = () => {
    if (!canGoPrev) {
      return;
    }
    setViewMonth(prev => (prev === 0 ? 11 : prev - 1));
    setViewYear(prev => (viewMonth === 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setViewMonth(prev => (prev === 11 ? 0 : prev + 1));
    setViewYear(prev => (viewMonth === 11 ? prev + 1 : prev));
  };

  const onTimePicked = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      setCustomValue(date);
      setSelectedTime(formatTime12h(date.getHours(), date.getMinutes()));
    }
  };

  const canConfirm = selectedDate !== null && selectedTime !== null;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.backdrop}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Choose date &amp; time</Text>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <CloseIcon color="#1F1611" size={14} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>Select date</Text>

            <View style={styles.calendar}>
              <View style={styles.monthRow}>
                <Pressable
                  accessibilityLabel="Previous month"
                  accessibilityRole="button"
                  disabled={!canGoPrev}
                  hitSlop={8}
                  onPress={goPrev}
                  style={({ pressed }) => [
                    styles.monthNav,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.flip}>
                    <ChevronRightIcon color={canGoPrev ? BODY : FAINT} size={16} />
                  </View>
                </Pressable>
                <Text style={styles.monthLabel}>
                  {MONTHS_LONG[viewMonth]} {viewYear}
                </Text>
                <Pressable
                  accessibilityLabel="Next month"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={goNext}
                  style={({ pressed }) => [
                    styles.monthNav,
                    pressed && styles.pressed,
                  ]}>
                  <ChevronRightIcon color={BODY} size={16} />
                </Pressable>
              </View>

              <View style={styles.weekRow}>
                {WEEKDAY_LABELS.map(label => (
                  <Text key={label} style={styles.weekday}>
                    {label}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {cells.map((day, index) => {
                  if (day === null) {
                    return <View key={`blank-${index}`} style={styles.cell} />;
                  }
                  const cellDate = new Date(viewYear, viewMonth, day);
                  const isPast = cellDate < today;
                  const isSelected =
                    selectedDate !== null &&
                    cellDate.getTime() === selectedDate.getTime();
                  return (
                    <Pressable
                      accessibilityLabel={`${day}`}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: isPast, selected: isSelected }}
                      disabled={isPast}
                      key={day}
                      onPress={() => setSelectedDate(cellDate)}
                      style={styles.cell}>
                      <View
                        style={[
                          styles.dayWrap,
                          isSelected && styles.daySelected,
                        ]}>
                        <Text
                          style={[
                            styles.dayText,
                            isPast && styles.dayPast,
                            isSelected && styles.daySelectedText,
                          ]}>
                          {day}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.tabs}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: tab === 'available' }}
                onPress={() => setTab('available')}
                style={[styles.tab, tab === 'available' && styles.tabActive]}>
                <Text
                  style={[
                    styles.tabLabel,
                    tab === 'available' && styles.tabLabelActive,
                  ]}>
                  Available times
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: tab === 'custom' }}
                onPress={() => setTab('custom')}
                style={[styles.tab, tab === 'custom' && styles.tabActive]}>
                <Text
                  style={[
                    styles.tabLabel,
                    tab === 'custom' && styles.tabLabelActive,
                  ]}>
                  Choose a time
                </Text>
              </Pressable>
            </View>

            {tab === 'available' ? (
              <View style={styles.slots}>
                {BOOKING_TIME_SLOTS.map(slot => {
                  const selected = slot === selectedTime;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={slot}
                      onPress={() => setSelectedTime(slot)}
                      style={[styles.slot, selected && styles.slotSelected]}>
                      <Text
                        style={[
                          styles.slotLabel,
                          selected && styles.slotLabelSelected,
                        ]}>
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.custom}>
                <Text style={styles.customHeading}>Select a custom time</Text>
                <Text style={styles.fieldLabel}>Preferred time</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowPicker(true)}
                  style={styles.timeField}>
                  <Text
                    style={[
                      styles.timeValue,
                      !selectedTime && styles.timePlaceholder,
                    ]}>
                    {selectedTime ?? '--:--'}
                  </Text>
                  <ClockIcon color={MUTED} size={18} />
                </Pressable>

                {showPicker ? (
                  <DateTimePicker
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    mode="time"
                    onChange={onTimePicked}
                    value={customValue ?? new Date()}
                  />
                ) : null}
              </View>
            )}

            <View style={styles.hintRow}>
              <InfoIcon color={MUTED} size={16} />
              <Text style={styles.hint}>
                {tab === 'available'
                  ? "Choose from the artisan's available time slot"
                  : 'Request a different time if none of the listed time slots work for you. The artisan will confirm availability'}
              </Text>
            </View>
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            disabled={!canConfirm}
            onPress={() => {
              if (selectedDate && selectedTime) {
                onConfirm(selectedDate, selectedTime);
              }
            }}
            style={({ pressed }) => [
              styles.confirm,
              !canConfirm && styles.confirmDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.confirmLabel}>Confirm date &amp; time</Text>
          </Pressable>
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
    backgroundColor: 'rgba(24, 16, 8, 0.45)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: '#E8E6E1',
    borderRadius: 3,
    height: 6,
    width: 56,
  },
  header: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
  },
  title: {
    color: TITLE,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  close: {
    alignItems: 'center',
    backgroundColor: '#F1E7D6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 40,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  sectionLabel: {
    color: TITLE,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  calendar: {
    borderColor: BORDER,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  monthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNav: {
    alignItems: 'center',
    backgroundColor: '#F1E7D6',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  flip: {
    transform: [{ scaleX: -1 }],
  },
  monthLabel: {
    color: TITLE,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    color: MUTED,
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  cell: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayWrap: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  daySelected: {
    backgroundColor: ACCENT,
  },
  dayText: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
  },
  dayPast: {
    color: FAINT,
  },
  daySelectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabs: {
    backgroundColor: '#F1E7D6',
    borderRadius: 12,
    flexDirection: 'row',
    marginTop: 18,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    paddingVertical: 11,
  },
  tabActive: {
    backgroundColor: '#FBF6EC',
    borderColor: BORDER,
    borderWidth: 1,
  },
  tabLabel: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  tabLabelActive: {
    color: ACCENT,
    fontWeight: '600',
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  slot: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '30.5%',
  },
  slotSelected: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  slotLabel: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
  },
  slotLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  custom: {
    marginTop: 18,
  },
  customHeading: {
    color: TITLE,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  fieldLabel: {
    color: BODY,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    marginTop: 12,
  },
  timeField: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  timeValue: {
    color: BODY,
    fontSize: 15,
    lineHeight: 20,
  },
  timePlaceholder: {
    color: FAINT,
    letterSpacing: 2,
  },
  hintRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  hint: {
    color: MUTED,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  confirm: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    marginTop: 12,
  },
  confirmDisabled: {
    opacity: 0.5,
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
