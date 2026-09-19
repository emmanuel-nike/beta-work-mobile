import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

/** Outline pin used in the recent-addresses list. */
export function MapPinIcon({ color = '#1B1105', size = 18 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 11.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
        stroke={color}
        strokeWidth={1.4}
      />
      <Path
        d="M3 8.3c1.6-7.1 12.4-7.1 14 0 1 4.2-1.6 7.7-3.9 9.9a3 3 0 0 1-4.2 0C6.6 16 4 12.5 3 8.3Z"
        stroke={color}
        strokeWidth={1.4}
      />
    </Svg>
  );
}
