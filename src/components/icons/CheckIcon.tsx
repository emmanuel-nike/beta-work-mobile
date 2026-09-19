import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function CheckIcon({ color = '#FFFFFF', size = 10 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 10 8" width={size}>
      <Path
        d="M1 4.2 3.5 6.7 9 1.2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
