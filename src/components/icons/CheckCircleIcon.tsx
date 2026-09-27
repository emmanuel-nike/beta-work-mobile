import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

/** Outline circle with a tick — a completed checklist step. */
export function CheckCircleIcon({
  color = '#695139',
  size = 18,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Circle cx={10} cy={10} r={7.9} stroke={color} strokeWidth={1.4} />
      <Path
        d="M6.7 10.2 8.9 12.4 13.3 7.9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
