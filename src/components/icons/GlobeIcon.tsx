import Svg, { Circle, Path } from 'react-native-svg';

import type { SizedIconProps } from './types';

export function GlobeIcon({ color = '#3D2E22', size = 16 }: SizedIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 20 20" width={size}>
      <Circle cx={10} cy={10} r={7.9} stroke={color} strokeWidth={1.4} />
      <Path
        d="M2.4 7.5h15.2M2.4 12.5h15.2"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.4}
      />
      <Path
        d="M10 2.1c3.9 4.3 3.9 11.5 0 15.8-3.9-4.3-3.9-11.5 0-15.8Z"
        stroke={color}
        strokeWidth={1.4}
      />
    </Svg>
  );
}
