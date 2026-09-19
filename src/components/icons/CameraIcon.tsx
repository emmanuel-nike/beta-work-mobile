import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function CameraIcon({ color = '#0F6743', size = 22 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M9.4 4.5h5.2l1.3 2.2h2.6A2.5 2.5 0 0 1 21 9.2v8.3a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V9.2a2.5 2.5 0 0 1 2.5-2.5h2.6l1.3-2.2Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
      <Circle cx={12} cy={13} r={3.6} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}
