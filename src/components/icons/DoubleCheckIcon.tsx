import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function DoubleCheckIcon({
  color = '#09C26F',
  size = 14,
}: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 12" width={size}>
      <Path
        d="M1 6.3 4 9.3 9.4 2.7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M6.6 9.3 12 2.7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
