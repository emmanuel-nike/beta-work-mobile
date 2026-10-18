import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

import {
  WEEKDAYS,
  type DaySchedule,
  type Weekday,
} from '../../data/artisanPortfolio';
import { appColors } from '../../theme/clientApp';
import { dashboardColors } from '../../theme/dashboard';
import { PortfolioField, StepIntro } from './PortfolioPrimitives';
import { TimeField } from './TimeField';
import type { PortfolioStepProps } from './types';

const TRACK = { false: '#CBBBA1', true: dashboardColors.accent };

/** Step 3 — "Set your working hours". */
export function PortfolioHoursStep({ form, update }: PortfolioStepProps) {
  const setDay = (day: Weekday, patch: Partial<DaySchedule>) => {
    update({
      weeklySchedule: {
        ...form.weeklySchedule,
        [day]: { ...form.weeklySchedule[day], ...patch },
      },
    });
  };

  return (
    <View style={styles.container}>
      <StepIntro
        subtitle="Choose your working hours to show clients your availability."
        title="Set your working hours"
      />

      <View style={styles.availabilityCard}>
        <View style={styles.availabilityCopy}>
          <Text style={styles.availabilityTitle}>
            Available to accept bookings?
          </Text>
          <Text style={styles.availabilityHint}>
            Turn off when you're not taking new jobs
          </Text>
        </View>
        <Switch
          ios_backgroundColor={TRACK.false}
          onValueChange={value => update({ isAvailable: value })}
          thumbColor={appColors.white}
          trackColor={TRACK}
          value={form.isAvailable}
        />
      </View>

      <PortfolioField
        hint="How many hours notice you need before a booking."
        label="Minimum lead time (hours)"
        numeric
        onChangeText={value => update({ minimumLeadTimeHours: value })}
        placeholder="e.g., 2 hours"
        value={form.minimumLeadTimeHours}
      />

      <View style={styles.scheduleIntro}>
        <Text style={styles.scheduleTitle}>Weekly schedule</Text>
        <Text style={styles.scheduleHint}>
          Clients see only active days and times.
        </Text>
      </View>

      {WEEKDAYS.map(day => {
        const value = form.weeklySchedule[day];
        return (
          <View key={day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day}</Text>
              <Switch
                ios_backgroundColor={TRACK.false}
                onValueChange={enabled => setDay(day, { enabled })}
                thumbColor={appColors.white}
                trackColor={TRACK}
                value={value.enabled}
              />
            </View>

            {value.enabled ? (
              <View style={styles.timesRow}>
                <View style={styles.timeCol}>
                  <TimeField
                    label="Start"
                    latest={value.end}
                    onChange={start => setDay(day, { start })}
                    placeholder="8:00 AM"
                    value={value.start}
                  />
                </View>
                <View style={styles.timeCol}>
                  <TimeField
                    earliest={value.start}
                    label="End"
                    onChange={end => setDay(day, { end })}
                    placeholder="6:00 PM"
                    value={value.end}
                  />
                </View>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  availabilityCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 237, 226, 0.5)',
    borderColor: '#D3C1A4',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 16,
  },
  availabilityCopy: {
    flex: 1,
    gap: 4,
  },
  availabilityTitle: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  availabilityHint: {
    color: appColors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  scheduleIntro: {
    gap: 4,
  },
  scheduleTitle: {
    color: appColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  scheduleHint: {
    color: appColors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  dayCard: {
    backgroundColor: 'rgba(245, 237, 226, 0.5)',
    borderColor: '#D3C1A4',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Keep the collapsed (toggle-off) card compact like the design.
    minHeight: Platform.OS === 'ios' ? 31 : 28,
  },
  dayName: {
    color: appColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  timesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
  },
});
