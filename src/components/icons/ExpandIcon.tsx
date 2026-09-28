import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function ExpandIcon({ color = '#FFFFFF', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <Path
        d="M9.3 2h4.7v4.7M14 2 9 7M6.7 14H2V9.3M2 14l5-5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}
