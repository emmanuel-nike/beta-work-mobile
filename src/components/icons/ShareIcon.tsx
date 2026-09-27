import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function ShareIcon({ color = '#1F1611', size = 18 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 12.9V2.5m0 0L6.7 5.8M10 2.5l3.3 3.3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M4.2 10.8c-1.4 0-2.5 1.1-2.5 2.5v2.9c0 1.4 1.1 2.5 2.5 2.5h11.6c1.4 0 2.5-1.1 2.5-2.5v-2.9c0-1.4-1.1-2.5-2.5-2.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
