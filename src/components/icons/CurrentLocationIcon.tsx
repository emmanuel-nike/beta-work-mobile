import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function CurrentLocationIcon({
  color = '#0F6743',
  size = 18,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 9.4a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke={color}
        strokeWidth={1.4}
      />
      <Path
        d="M3.8 6.6c1.5-6.4 10.9-6.4 12.4 0 .9 3.8-1.4 7-3.4 9a3 3 0 0 1-4 0"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.4}
      />
      <Path
        d="M7.3 14.2c-2 .3-3.3 1-3.3 1.9 0 1.3 2.7 2.3 6 2.3s6-1 6-2.3c0-.9-1.3-1.6-3.2-1.9"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
