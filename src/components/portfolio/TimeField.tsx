import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../theme/clientApp';
import { ChevronDownIcon, CloseIcon } from '../icons';
import { FieldLabel } from './PortfolioPrimitives';

type TimeFieldProps = Readonly<{
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  /** End time must be after this start time. */
  earliest?: string;
  /** Start time must be before this end time. */
  latest?: string;
}>;

function parseHHmm(value: string, fallbackHour: number): Date {
  const date = new Date();
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (match) {
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
    return date;
  }
  date.setHours(fallbackHour, 0, 0, 0);
  return date;
}

function formatHHmm(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

function formatDisplay(value: string, fallback: string): string {
  if (!value) {
    return fallback;
  }
  const date = parseHHmm(value, 8);
  const hours = date.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${period}`;
}

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function isEndAfterStart(start: string, end: string): boolean {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) {
    return true;
  }
  return endMinutes > startMinutes;
}

/** Pressable time field that opens the native iOS / Android time picker. */
export function TimeField({
  label,
  value,
  placeholder,
  onChange,
  earliest,
  latest,
}: TimeFieldProps) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const fallbackHour = earliest ? 18 : 8;
  const pickerValue = parseHHmm(value, fallbackHour);
  const [draft, setDraft] = useState(pickerValue);

  const commit = (next: Date) => {
    const formatted = formatHHmm(next);
    if (earliest && !isEndAfterStart(earliest, formatted)) {
      Alert.alert('Invalid hours', 'End time must be after the start time.');
      return false;
    }
    if (latest && !isEndAfterStart(formatted, latest)) {
      Alert.alert('Invalid hours', 'Start time must be before the end time.');
      return false;
    }
    onChange(formatted);
    return true;
  };

  const openPicker = () => {
    setDraft(parseHHmm(value, fallbackHour));
    setOpen(true);
  };

  const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    setOpen(false);
    if (event.type !== 'set' || !date) {
      return;
    }
    commit(date);
  };

  return (
    <View style={styles.field}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        onPress={openPicker}
        style={({ pressed }) => [styles.select, pressed && styles.pressed]}
      >
        <Text style={styles.value}>{formatDisplay(value, placeholder)}</Text>
        <ChevronDownIcon color={appColors.textLabel} size={18} />
      </Pressable>

      {open && Platform.OS === 'android' ? (
        <DateTimePicker
          display="default"
          is24Hour={false}
          mode="time"
          onChange={handleAndroidChange}
          value={pickerValue}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          animationType="slide"
          onRequestClose={() => setOpen(false)}
          presentationStyle="overFullScreen"
          transparent
          visible={open}
        >
          <View style={styles.sheetRoot}>
            <Pressable
              accessibilityLabel="Dismiss"
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={styles.backdrop}
            />
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
              <View style={styles.header}>
                <Text style={styles.title}>{label}</Text>
                <Pressable
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                  hitSlop={12}
                  onPress={() => setOpen(false)}
                  style={({ pressed }) => [
                    styles.close,
                    pressed && styles.pressed,
                  ]}
                >
                  <CloseIcon color="#4A3A2C" size={16} />
                </Pressable>
              </View>

              <DateTimePicker
                accentColor={appColors.primary}
                display="spinner"
                locale="en_US"
                mode="time"
                onChange={(_, date) => {
                  if (date) {
                    setDraft(date);
                  }
                }}
                style={styles.picker}
                themeVariant="light"
                value={draft}
              />

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (commit(draft)) {
                    setOpen(false);
                  }
                }}
                style={({ pressed }) => [
                  styles.doneButton,
                  pressed && styles.donePressed,
                ]}
              >
                <Text style={styles.doneLabel}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  select: {
    alignItems: 'center',
    backgroundColor: appColors.field,
    borderColor: '#C5B294',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  value: {
    color: appColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.6,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 16, 8, 0.28)',
  },
  sheet: {
    backgroundColor: appColors.field,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  title: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  close: {
    position: 'absolute',
    right: 0,
  },
  picker: {
    alignSelf: 'stretch',
    height: 216,
  },
  doneButton: {
    alignItems: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
  },
  donePressed: {
    opacity: 0.85,
  },
  doneLabel: {
    color: appColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
});
