import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function DocumentIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M17.5 7.5v5c0 4.2-1.7 5.8-5.8 5.8H8.3c-4.2 0-5.8-1.6-5.8-5.8V7.5c0-4.2 1.6-5.8 5.8-5.8h3.4c4.1 0 5.8 1.6 5.8 5.8Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M6.7 7.1h6.6M6.7 10.4h6.6M6.7 13.8h3.3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
