import Svg, { Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function StickerIcon({ color = '#4A3A2C', size = 20 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M11.7 2.5H6.3c-2.35 0-3.8 1.33-3.8 3.68v7.64c0 2.35 1.45 3.68 3.8 3.68h4.2l7-6.9V6.18c0-2.35-1.45-3.68-3.8-3.68Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <Path
        d="M17.5 10.6h-3.4c-2 0-3.6 1.1-3.6 3.5v3"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
    </Svg>
  );
}
