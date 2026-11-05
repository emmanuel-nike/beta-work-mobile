import { StyleSheet, Text, View } from 'react-native';

import type { TimelineState, TimelineStep } from '../../data/bookings';
import { bookingColors, timelineColors } from '../../theme/bookings';
import { CheckIcon, CloseIcon } from '../icons';

const DOT_SIZE = 20;

function timestamp(step: TimelineStep): string {
  const parts = [step.date, step.time].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '—';
}
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
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isMuted = step.state === 'pending';

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  step.state === 'active' && styles.dotActive,
                  step.state === 'pending' && styles.dotPending,
                  step.state === 'done' && {
                    backgroundColor: DOT_COLORS.done,
                  },
                  step.state === 'cancelled' && {
                    backgroundColor: DOT_COLORS.cancelled,
                  },
                ]}
              >
                {step.state === 'done' ? <CheckIcon /> : null}
                {step.state === 'cancelled' ? (
                  <CloseIcon color={bookingColors.white} size={10} />
                ) : null}
              </View>
              {isLast ? null : (
                <View
                  style={[
                    styles.track,
                    step.state === 'done' && styles.trackDone,
                  ]}
                />
              )}
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
                <Text style={styles.date}>{timestamp(step)}</Text>
              </View>
              {step.detail ? <Text style={styles.time}>{step.detail}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
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
    backgroundColor: 'transparent',
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    justifyContent: 'center',
    width: DOT_SIZE,
  },
  dotActive: {
    borderColor: timelineColors.active,
    borderWidth: 2,
  },
  dotPending: {
    borderColor: timelineColors.pending,
    borderWidth: 2,
  },
  track: {
    backgroundColor: timelineColors.track,
    flex: 1,
    width: 2,
  },
  trackDone: {
    backgroundColor: timelineColors.done,
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
    fontWeight: '600',
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
