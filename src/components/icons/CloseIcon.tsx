import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function CloseIcon({ color = '#3A281A', size = 14 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 14 14" width={size}>
      <Path
        d="M3 3l8 8M11 3l-8 8"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
