import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function ShieldIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 1.9 4.2 4.1c-.7.3-1.2 1-1.2 1.8v4.6c0 3.7 2.7 7.2 6.3 8.2.4.1.9.1 1.4 0 3.6-1 6.3-4.5 6.3-8.2V5.9c0-.8-.5-1.5-1.2-1.8L10 1.9Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M10 7v3.3M10 13h.01"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
