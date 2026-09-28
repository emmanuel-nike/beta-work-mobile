import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function BuildingIcon({ color = '#9C7E61', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M2.5 18.3h15M3.75 18.3V5.4c0-.74.35-1.44.95-1.87l4.17-3a1.9 1.9 0 0 1 2.26 0l4.17 3c.6.43.95 1.13.95 1.87v12.9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M8 9.6h4M8 12.6h4M10 18.3v-3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
