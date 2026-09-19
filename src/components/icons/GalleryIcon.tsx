import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function GalleryIcon({ color = '#0F6743', size = 22 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Rect
        height={17}
        rx={3}
        stroke={color}
        strokeWidth={1.6}
        width={17}
        x={3.5}
        y={3.5}
      />
      <Circle cx={9} cy={9} r={1.9} stroke={color} strokeWidth={1.6} />
      <Path
        d="m4.5 17 4.2-4.2a2 2 0 0 1 2.7 0l3.4 3.4m0 0 1.4-1.4a2 2 0 0 1 2.7 0l1.6 1.5m-5.7-.1 2 2"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
