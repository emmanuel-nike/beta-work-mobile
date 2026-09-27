import { useCallback, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';

const THUMB_RADIUS = 7;
const TRACK_HEIGHT = 7;

export type Range = Readonly<{ min: number; max: number }>;

type RangeSliderProps = Readonly<{
  /** Lowest and highest selectable values. */
  bounds: Range;
  value: Range;
  onChange: (value: Range) => void;
  step?: number;
}>;

/**
 * Two-thumb range slider. Built on PanResponder so it needs no native module;
 * the thumbs cannot cross because each is clamped against the other.
 */
export function RangeSlider({
  bounds,
  value,
  onChange,
  step = 1,
}: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  // Panning reads these through refs so the responders never go stale.
  const widthRef = useRef(0);
  const valueRef = useRef(value);
  valueRef.current = value;

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    widthRef.current = next;
    setWidth(next);
  };

  const span = bounds.max - bounds.min;

  const toPosition = useCallback(
    (amount: number) =>
      span === 0 ? 0 : ((amount - bounds.min) / span) * width,
    [bounds.min, span, width],
  );

  const makeResponder = (thumb: 'min' | 'max') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gesture) => {
        const trackWidth = widthRef.current;
        if (trackWidth <= 0) {
          return;
        }

        const current = valueRef.current;
        const origin = thumb === 'min' ? current.min : current.max;
        const delta = (gesture.dx / trackWidth) * span;
        const stepped =
          Math.round((origin + delta) / step) * step;

        if (thumb === 'min') {
          const next = Math.min(
            Math.max(stepped, bounds.min),
            current.max - step,
          );
          if (next !== current.min) {
            onChange({ min: next, max: current.max });
          }
          return;
        }

        const next = Math.max(
          Math.min(stepped, bounds.max),
          current.min + step,
        );
        if (next !== current.max) {
          onChange({ min: current.min, max: next });
        }
      },
    });

  // Gesture deltas are measured from where each drag began, so the responders
  // are rebuilt per render against the latest committed value.
  const minResponder = makeResponder('min');
  const maxResponder = makeResponder('max');

  const minX = toPosition(value.min);
  const maxX = toPosition(value.max);

  return (
    <View onLayout={handleLayout} style={styles.root}>
      <View style={styles.track} />
      {width > 0 ? (
        <>
          <View
            style={[styles.fill, { left: minX, width: Math.max(maxX - minX, 0) }]}
          />
          <View
            {...minResponder.panHandlers}
            accessibilityRole="adjustable"
            accessibilityValue={{ now: value.min, min: bounds.min, max: bounds.max }}
            hitSlop={12}
            style={[styles.thumb, { left: minX - THUMB_RADIUS }]}
          />
          <View
            {...maxResponder.panHandlers}
            accessibilityRole="adjustable"
            accessibilityValue={{ now: value.max, min: bounds.min, max: bounds.max }}
            hitSlop={12}
            style={[styles.thumb, { left: maxX - THUMB_RADIUS }]}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: THUMB_RADIUS * 2,
    justifyContent: 'center',
  },
  track: {
    backgroundColor: '#E5E7EB',
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    width: '100%',
  },
  fill: {
    backgroundColor: '#0F6743',
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    position: 'absolute',
  },
  thumb: {
    backgroundColor: '#0F6743',
    borderRadius: THUMB_RADIUS,
    height: THUMB_RADIUS * 2,
    position: 'absolute',
    width: THUMB_RADIUS * 2,
  },
});
