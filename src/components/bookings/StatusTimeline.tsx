import { StyleSheet, Text, View } from 'react-native';

import type { TimelineState, TimelineStep } from '../../data/bookings';
import { bookingColors, timelineColors } from '../../theme/bookings';
import { CheckIcon, CloseIcon } from '../icons';

const DOT_SIZE = 18;
const ROW_GAP = 28;

const DOT_COLORS: Record<TimelineState, string> = {
  done: timelineColors.done,
  active: timelineColors.active,
  pending: timelineColors.pending,
  cancelled: timelineColors.cancelled,
};

type StatusTimelineProps = Readonly<{
  steps: readonly TimelineStep[];
}>;

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <View style={styles.card}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isMuted = step.state === 'pending';

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: DOT_COLORS[step.state] },
                ]}
              >
                {step.state === 'done' ? <CheckIcon /> : null}
                {step.state === 'cancelled' ? (
                  <CloseIcon color={bookingColors.white} size={10} />
                ) : null}
              </View>
              {isLast ? null : <View style={styles.track} />}
            </View>

            <View style={[styles.content, isLast && styles.contentLast]}>
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.label,
                    isMuted && styles.labelMuted,
                    step.state === 'active' && styles.labelActive,
                    step.state === 'cancelled' && styles.labelCancelled,
                  ]}
                >
                  {step.label}
                </Text>
                {step.date ? <Text style={styles.date}>{step.date}</Text> : null}
              </View>
              {step.time ? <Text style={styles.time}>{step.time}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: bookingColors.card,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rail: {
    alignItems: 'center',
    width: DOT_SIZE,
  },
  dot: {
    alignItems: 'center',
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    justifyContent: 'center',
    width: DOT_SIZE,
  },
  track: {
    backgroundColor: timelineColors.track,
    flex: 1,
    width: 2,
  },
  content: {
    flex: 1,
    paddingBottom: ROW_GAP,
  },
  contentLast: {
    paddingBottom: 0,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  label: {
    color: bookingColors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  labelMuted: {
    color: bookingColors.textFaint,
  },
  labelActive: {
    color: timelineColors.active,
  },
  labelCancelled: {
    color: timelineColors.cancelled,
  },
  date: {
    color: bookingColors.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  time: {
    color: bookingColors.textMuted,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },
});
